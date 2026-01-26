import { fetchAllTagsWithPostCount } from "@repo/actions";
import TagComponentRendering from "./tag-component-rendering";

async function TagComponent(): Promise<JSX.Element> {
  // const router = useRouter();

  const tags = await fetchAllTagsWithPostCount();

  return <TagComponentRendering tags={tags} />;
}

export default TagComponent;
