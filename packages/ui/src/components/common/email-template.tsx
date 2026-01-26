import {
  Head,
  Hr,
  Html,
  Img,
  Markdown,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
} from "@react-email/components";
import { PostListType } from "@repo/actions";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function EmailTemplate(props: EmailTemplateProps) {
  const { name, email, message } = props;

  return (
    <Html>
      <ul>
        <li>
          <strong>Name:</strong> {name}
        </li>
        <li>
          <strong>Email:</strong> {email}
        </li>
        <li>
          <strong>Message:</strong> {message}
        </li>
      </ul>
    </Html>
  );
}
interface NewsletterTemplateProps {
  post: PostListType;
  markdown?: string;
}

export function NewsletterTemplate(props: NewsletterTemplateProps) {
  const { post, markdown = "" } = props;

  return (
    <Html>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Body
        style={{
          backgroundColor: "#000000",
          margin: "0",
          padding: "20px",
          fontFamily: "Inter, sans-serif",
          borderRadius: "8px",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px",
            maxWidth: "640px",
            backgroundColor: "#111111",
            borderRadius: "8px",
          }}
        >
          {/* Feature Image Section */}
          <Section style={{ padding: "20px", borderRadius: "8px" }}>
            {post.featureImage && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Img
                  src={post.featureImage}
                  alt={post.title}
                  width="600"
                  height="auto"
                  style={{
                    borderRadius: "8px",
                    maxWidth: "100%",
                  }}
                />
              </div>
            )}
          </Section>

          {/* Title Section */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Text
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "0 0 24px",
                color: "#ffffff",
                lineHeight: "1.2",
              }}
            >
              {post.title}
            </Text>
          </Section>

          {/* Author Info Section */}
          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <Section
              style={{
                textAlign: "center",
                display: "inline-block",
                marginTop: "5px",
                maxHeight: "48px",
                maxWidth: "48px",
              }}
            >
              <Img
                alt={post.author?.name || ""}
                height={48}
                src={post.author?.imageUrl || ""}
                style={{
                  borderRadius: "9999px",
                  display: "block",
                  height: "48px",
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "48px",
                }}
                width={48}
              />
            </Section>
            <Section
              style={{
                display: "inline-block",
                marginLeft: "18px",
                maxWidth: "120px",
                textAlign: "left",
                verticalAlign: "top",
              }}
            >
              <Heading
                as="h3"
                style={{
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "20px",
                  margin: "0px",
                }}
              >
                {post.author?.name || ""}
              </Heading>
              <Text
                style={{
                  color: "rgb(107,114,128)",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "14px",
                  margin: "0px",
                }}
              >
                Founder & CEO
              </Text>
              <Section
                style={{
                  marginTop: "4px",
                }}
              >
                <Link
                  href="https://x.com/deepshaswat"
                  style={{
                    display: "inline-flex",
                    height: "12px",
                    width: "12px",
                  }}
                >
                  <Img
                    alt="X"
                    src="https://react.email/static/x-icon.png"
                    style={{ height: "12px", width: "12px" }}
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/deepshaswat/"
                  style={{
                    display: "inline-flex",
                    height: "12px",
                    marginLeft: "8px",
                    width: "12px",
                  }}
                >
                  <Img
                    alt="LinkedIn"
                    src="https://react.email/static/in-icon.png"
                    style={{ height: "12px", width: "12px" }}
                  />
                </Link>
              </Section>
            </Section>
          </Section>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            {/* Date and View in Browser */}
            <Text
              style={{
                fontSize: "14px",
                color: "#a3a3a3",
                margin: "0",
              }}
            >
              {new Date(post.publishDate || "").toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" · "}
              <Link
                href={`https://deepshaswat.com/${post.postUrl}`}
                style={{
                  color: "#d4d4d4",
                  textDecoration: "underline",
                }}
              >
                View in browser
              </Link>
            </Text>
          </Section>

          {/* Content Section */}
          <Section style={{ padding: "0 20px" }}>
            <Markdown
              markdownCustomStyles={{
                p: {
                  margin: "16px 0",
                  lineHeight: "1.6",
                  fontSize: "16px",
                },
                h1: {
                  fontSize: "24px",
                  marginBottom: "16px",
                  marginTop: "32px",
                },
                h2: {
                  fontSize: "20px",
                  marginBottom: "14px",
                  marginTop: "28px",
                },
                h3: {
                  fontSize: "18px",
                  marginBottom: "12px",
                  marginTop: "24px",
                },
                ul: {
                  marginLeft: "20px",
                  marginBottom: "16px",
                },
                ol: {
                  marginLeft: "20px",
                  marginBottom: "16px",
                },
                li: { margin: "8px 0", lineHeight: "1.6" },
              }}
            >
              {markdown}
            </Markdown>
          </Section>

          {/* Footer Section */}
          <Section>
            <Hr
              style={{
                margin: "40px 0",
                borderColor: "#333333",
              }}
            />
            <Section
              style={{
                textAlign: "center",
                color: "#a3a3a3",
                fontSize: "14px",
                padding: "0 20px",
              }}
            >
              <Text style={{ margin: "0 0 12px" }}>
                You are receiving this email because you are subscribed to the
                newsletter.
              </Text>
              <Link
                href="https://deepshaswat.com/unsubscribe"
                style={footerLink}
              >
                Unsubscribe from emails like this
              </Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const footerLink = {
  display: "inline-block",
  color: "#9199a1",
  textDecoration: "underline",
  fontSize: "12px",
  marginRight: "10px",
  marginBottom: "0",
  marginTop: "8px",
};
