import { fetchTagDetails } from "@repo/actions";
import EditComponent from "../../_components/tags/edit-component";
import { notFound } from "next/navigation";

export default async function ({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const tag = await fetchTagDetails(slug);

  //Handle case where blog post is not found
  if (tag === null) {
    notFound();
  }

  return (
    <EditComponent
      id={tag?.id || ""}
      slug={tag?.slug || ""}
      description={tag?.description || ""}
      imageUrl={tag?.imageUrl || ""}
    />
  );
}
