import type { PostListType } from "@repo/actions";
import { fetchPostById } from "@repo/actions";
import { redirect } from "next/navigation";
import { EditContentPost } from "./edit-content-post";

async function EditPostComponent({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const post = await fetchPostById(params.id);

  if (!post) {
    redirect("/posts");
  }

  return <EditContentPost initialPost={post as PostListType} />;
}

export default EditPostComponent;
