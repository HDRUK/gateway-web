import metaData, { noFollowRobots } from "@/utils/metadata";
import UserLibrary from "./components/UserLibrary";

export const metadata = metaData(
    {
        title: "Library",
        description: "",
    },
    noFollowRobots
);
export default function LibraryPage() {
    return <UserLibrary />;
}
