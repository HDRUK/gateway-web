import UserLibrary from "./components/UserLibrary";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Library",
    description: "",
}, noFollowRobots);
export default function LibraryPage() {
    return <UserLibrary />;
}
