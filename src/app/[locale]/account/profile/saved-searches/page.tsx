import SavedSearches from "./SavedSearches";
import metaData, {noFollowRobots} from "@/utils/metdata";
export const metadata = metaData({
    title: "Saved Searches",
    description: ""
}, noFollowRobots);
export default function SavedSearchesPage() {
    return <SavedSearches />;
}
