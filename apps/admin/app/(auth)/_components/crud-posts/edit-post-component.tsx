import { fetchPostById, PostListType } from "@repo/actions";
import { EditContentPost } from "./edit-content-post";

const EditPostComponent = async ({ params }: { params: { id: string } }) => {
  const post = await fetchPostById(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <EditContentPost initialPost={post as PostListType} />;
};

export default EditPostComponent;
