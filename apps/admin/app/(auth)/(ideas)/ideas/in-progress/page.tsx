import { IdeasComponent } from "../../../_components/ideas/ideas-component";

export const dynamic = "force-dynamic";

export default function InProgressIdeas(): JSX.Element {
  return <IdeasComponent defaultFilter="IN_PROGRESS" pageTitle="In Progress" />;
}
