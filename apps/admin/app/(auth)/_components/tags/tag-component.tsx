import { fetchAllTagsWithPostCount } from "@repo/actions";
import TagComponentRendering from "../../_components/tags/tag-component-rendering";

const TagComponent = async () => {
  // const router = useRouter();

  const tags = await fetchAllTagsWithPostCount();

  return <TagComponentRendering tags={tags} />;
};

export default TagComponent;
