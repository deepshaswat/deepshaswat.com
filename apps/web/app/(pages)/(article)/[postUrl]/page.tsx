export default function EditorPage({
  params,
}: {
  params: { postUrl: string };
}) {
  return <div>Hello params: {params.postUrl}</div>;
}
