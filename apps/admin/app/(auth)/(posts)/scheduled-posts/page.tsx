import PostsComponent from "../../_components/posts/posts-components";

export const dynamic = "force-dynamic";

export default function ScheduledPosts(): JSX.Element {
  return (
    <PostsComponent
      defaultFilter="scheduled-posts"
      pageTitle="Scheduled Posts"
    />
  );
}
