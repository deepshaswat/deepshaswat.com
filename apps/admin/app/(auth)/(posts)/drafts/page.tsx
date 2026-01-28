import PostsComponent from "../../_components/posts/posts-components";

export const dynamic = "force-dynamic";

export default function Drafts(): JSX.Element {
  return <PostsComponent defaultFilter="draft-posts" pageTitle="Drafts" />;
}
