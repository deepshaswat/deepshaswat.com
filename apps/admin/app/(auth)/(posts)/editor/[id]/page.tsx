import EditPostComponent from "../../../_components/crud-posts/edit-post-component";

export const dynamic = "force-dynamic";

export default function EditorPage({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  return <EditPostComponent params={params} />;
}
