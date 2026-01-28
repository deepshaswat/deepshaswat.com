import PostsComponent from "../../_components/posts/posts-components";

export const dynamic = "force-dynamic";

export default function Published(): JSX.Element {
  return <PostsComponent defaultFilter="published-posts" />;
}
