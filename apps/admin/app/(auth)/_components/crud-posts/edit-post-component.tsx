import type { PostListType } from "@repo/actions";
import { fetchPostById } from "@repo/actions";
import { EditContentPost } from "./edit-content-post";

async function EditPostComponent({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const post = await fetchPostById(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <EditContentPost initialPost={post as PostListType} />;
}

export default EditPostComponent;
