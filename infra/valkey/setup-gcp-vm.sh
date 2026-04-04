#!/usr/bin/env bash
# GCP VM setup script for self-hosted Valkey
# Sized for a blog/newsletter platform (minimal resources)
#
# Prerequisites:
#   - gcloud CLI authenticated: gcloud auth login
#   - Project set: gcloud config set project <PROJECT_ID>
#
# Usage:
#   1. Edit the variables below
#   2. Run: bash setup-gcp-vm.sh

set -euo pipefail

# ── Configuration ──────────────────────────────────────────
PROJECT_ID="$(gcloud config get-value project)"
VM_NAME="deepshaswat-valkey"
ZONE="us-central1-a"
MACHINE_TYPE="e2-small"  # 2 vCPU, 2GB RAM — plenty for a blog cache
BOOT_DISK_SIZE="10GB"

# Generate a strong password (change this!)
REDIS_PASSWORD="CHANGE_ME_GENERATE_WITH_OPENSSL_RAND_HEX_32"

echo "==> Creating VM: $VM_NAME in $ZONE ($MACHINE_TYPE)"

# ── 1. Create the VM ──────────────────────────────────────
gcloud compute instances create "$VM_NAME" \
  --project="$PROJECT_ID" \
  --zone="$ZONE" \
  --machine-type="$MACHINE_TYPE" \
  --boot-disk-size="$BOOT_DISK_SIZE" \
  --boot-disk-type=pd-standard \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --tags=valkey-server \
  --metadata=startup-script='#!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose-v2
    systemctl enable docker
    systemctl start docker
  '

echo "==> Waiting for VM to boot..."
sleep 30

# ── 2. Reserve a static external IP ──────────────────────
echo "==> Reserving static IP..."
gcloud compute addresses create "$VM_NAME-ip" \
  --project="$PROJECT_ID" \
  --region="${ZONE%-*}" \
  2>/dev/null || echo "    (IP already exists)"

STATIC_IP=$(gcloud compute addresses describe "$VM_NAME-ip" \
  --project="$PROJECT_ID" \
  --region="${ZONE%-*}" \
  --format='get(address)')

# Assign static IP to the VM
gcloud compute instances delete-access-config "$VM_NAME" \
  --project="$PROJECT_ID" \
  --zone="$ZONE" \
  --access-config-name="external-nat" 2>/dev/null || true

gcloud compute instances add-access-config "$VM_NAME" \
  --project="$PROJECT_ID" \
  --zone="$ZONE" \
  --address="$STATIC_IP"

echo "    Static IP: $STATIC_IP"

# ── 3. Firewall rule for port 6379 ───────────────────────
echo "==> Creating firewall rule..."
gcloud compute firewall-rules create allow-valkey \
  --project="$PROJECT_ID" \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:6379 \
  --target-tags=valkey-server \
  --description="Allow Valkey/Redis traffic on port 6379" \
  2>/dev/null || echo "    (Firewall rule already exists)"

# ── 4. Compute SHA256 of password for ACL ─────────────────
PASSWORD_SHA256=$(echo -n "$REDIS_PASSWORD" | sha256sum | awk '{print $1}')

# ── 5. Copy files and configure ───────────────────────────
echo "==> Configuring Valkey on the VM..."

gcloud compute ssh "$VM_NAME" --zone="$ZONE" --project="$PROJECT_ID" --command="
  sudo mkdir -p /opt/valkey

  # Create ACL file
  sudo tee /opt/valkey/users.acl > /dev/null <<ACLEOF
user default on #${PASSWORD_SHA256} ~* &* +@all
user deepshaswat on #${PASSWORD_SHA256} ~* &* +@all
ACLEOF

  # Create docker-compose.yml
  sudo tee /opt/valkey/docker-compose.yml > /dev/null <<COMPOSEEOF
services:
  valkey:
    image: valkey/valkey:8
    container_name: deepshaswat-valkey
    restart: unless-stopped
    ports:
      - \"6379:6379\"
    command: >
      valkey-server
        --requirepass ${REDIS_PASSWORD}
        --maxmemory 256mb
        --maxmemory-policy allkeys-lru
        --save \"\"
        --appendonly no
        --protected-mode no
        --tcp-backlog 128
        --timeout 300
        --tcp-keepalive 60
        --maxclients 1000
        --aclfile /data/users.acl
    volumes:
      - ./users.acl:/data/users.acl
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: \"1\"
    healthcheck:
      test: [\"CMD\", \"valkey-cli\", \"-a\", \"${REDIS_PASSWORD}\", \"ping\"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
COMPOSEEOF

  # Create health check script
  sudo tee /opt/valkey/health-check.sh > /dev/null <<'HEALTHEOF'
#!/usr/bin/env bash
set -euo pipefail
COMPOSE_DIR=\"/opt/valkey\"
CONTAINER_NAME=\"deepshaswat-valkey\"
if ! docker inspect --format='{{.State.Running}}' \"\$CONTAINER_NAME\" 2>/dev/null | grep -q true; then
  echo \"\$(date -Iseconds) [WARN] Valkey container not running. Restarting...\"
  cd \"\$COMPOSE_DIR\" && docker compose up -d
  exit 0
fi
if ! docker exec \"\$CONTAINER_NAME\" valkey-cli ping 2>/dev/null | grep -q PONG; then
  echo \"\$(date -Iseconds) [WARN] Valkey not responding to PING. Restarting...\"
  cd \"\$COMPOSE_DIR\" && docker compose restart
  exit 0
fi
echo \"\$(date -Iseconds) [OK] Valkey healthy.\"
HEALTHEOF
  sudo chmod +x /opt/valkey/health-check.sh

  # Create systemd service
  sudo tee /etc/systemd/system/valkey.service > /dev/null <<'SVCEOF'
[Unit]
Description=Valkey Cache (Docker Compose)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/valkey
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=30

[Install]
WantedBy=multi-user.target
SVCEOF

  # Enable and start
  sudo systemctl daemon-reload
  sudo systemctl enable valkey.service
  cd /opt/valkey && sudo docker compose up -d

  # Set up health check cron (every 5 min)
  (sudo crontab -l 2>/dev/null || true; echo '*/5 * * * * /opt/valkey/health-check.sh >> /var/log/valkey-health.log 2>&1') | sudo crontab -

  echo 'Valkey setup complete!'
"

echo ""
echo "==> Setup complete!"
echo ""
echo "  Static IP:      $STATIC_IP"
echo "  Port:           6379"
echo "  Username:       deepshaswat"
echo "  Password:       $REDIS_PASSWORD"
echo ""
echo "  Environment variables for Vercel:"
echo "    REDIS_HOST=$STATIC_IP"
echo "    REDIS_PORT=6379"
echo "    REDIS_USERNAME=deepshaswat"
echo "    REDIS_PASSWORD=$REDIS_PASSWORD"
echo "    REDIS_TLS=false"
echo ""
echo "  Test connection:"
echo "    redis-cli -h $STATIC_IP -u redis://deepshaswat:${REDIS_PASSWORD}@${STATIC_IP}:6379 ping"
