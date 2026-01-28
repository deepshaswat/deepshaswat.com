import { IdeasComponent } from "../../../_components/ideas/ideas-component";

export const dynamic = "force-dynamic";

export default function ArchivedIdeas(): JSX.Element {
  return <IdeasComponent defaultFilter="ARCHIVED" pageTitle="Archived Ideas" />;
}
