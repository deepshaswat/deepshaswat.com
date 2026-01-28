import { IdeasComponent } from "../../../_components/ideas/ideas-component";

export const dynamic = "force-dynamic";

export default function DraftCreatedIdeas(): JSX.Element {
  return (
    <IdeasComponent defaultFilter="DRAFT_CREATED" pageTitle="Draft Created" />
  );
}
