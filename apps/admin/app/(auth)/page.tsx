import { DashboardComponent } from "./_components/dashboard/dashboard-component";

// Force dynamic rendering to prevent build-time prerendering
export const dynamic = "force-dynamic";

export default function Page(): JSX.Element {
  return <DashboardComponent />;
}
