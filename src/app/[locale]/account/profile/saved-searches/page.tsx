import metaData, { noFollowRobots } from "@/utils/metadata";
import SavedSearches from "./SavedSearches";

export const metadata = metaData(
    {
        title: "Saved Searches",
        description: "",
    },
    noFollowRobots
);
export default function SavedSearchesPage() {
    return <SavedSearches />;
}
