import metaData, { noFollowRobots } from "@/utils/metadata";
import CohortDiscoveryCoverPage from "./components/CohortDiscoveryCoverPage";

export const metadata = metaData(
    {
        title: "CohortDiscovery",
        description: "",
    },
    noFollowRobots
);

const CohortDiscoveryPage = async () => <CohortDiscoveryCoverPage />;

export default CohortDiscoveryPage;
