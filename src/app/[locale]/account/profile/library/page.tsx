import { getCohortDiscovery } from "@/utils/cms";
import metaData, { noFollowRobots } from "@/utils/metadata";
import UserLibrary from "./components/UserLibrary";

export const metadata = metaData(
    {
        title: "Library",
        description: "",
    },
    noFollowRobots
);

export default async function LibraryPage() {
    const cohortDiscovery = await getCohortDiscovery();
    return <UserLibrary cohortDiscovery={cohortDiscovery} />;
}
