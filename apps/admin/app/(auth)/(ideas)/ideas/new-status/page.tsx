import { IdeasComponent } from "../../../_components/ideas/ideas-component";

export const dynamic = "force-dynamic";

export default function NewStatusIdeas(): JSX.Element {
  return <IdeasComponent defaultFilter="NEW" pageTitle="New Ideas" />;
}
