import PostsComponent from "../../_components/posts/posts-components";

export const dynamic = "force-dynamic";

export default function Newsletters(): JSX.Element {
  return <PostsComponent defaultFilter="newsletters" />;
}
