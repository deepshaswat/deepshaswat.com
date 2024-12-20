import EditPostComponent from "../../../_components/crud-posts/edit-post-component";

export default function EditorPage({ params }: { params: { id: string } }) {
  return <EditPostComponent params={params} />;
}
