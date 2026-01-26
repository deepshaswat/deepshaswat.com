import { fetchTagDetails } from "@repo/actions";
import { notFound } from "next/navigation";
import EditComponent from "../../_components/tags/edit-component";

export default async function TagSlugPage({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const { slug } = params;
  const tag = await fetchTagDetails(slug);

  if (tag === null) {
    notFound();
  }

  return (
    <EditComponent
      description={tag.description ?? ""}
      id={tag.id}
      imageUrl={tag.imageUrl ?? ""}
      slug={tag.slug}
    />
  );
}
