import { Head, Hr, Html, Img, Markdown, Body } from "@react-email/components";
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

// This is the server component that will be used by resend
export function NewsletterTemplate(props: NewsletterTemplateProps) {
  const { post, markdown = "" } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{post.title}</title>
      </Head>
      <Body>
        {post.featureImage && (
          <Img
            src={post.featureImage}
            alt={post.title}
            width={500}
            height={500}
          />
        )}
        <Markdown>{markdown}</Markdown>
      </Body>
      <Hr />
      <p>
        You are receiving this email because you are subscribed to the
        newsletter of {post.author?.name}.
      </p>
    </Html>
  );
}
