import { getCohortTermsAndConditions } from "@/utils/cms";
import metaData, { noFollowRobots } from "@/utils/metadata";
import CohortDiscoveryCoverPage from "./components/CohortDiscoveryCoverPage";

export const metadata = metaData(
    {
        title: "CohortDiscovery",
        description: "",
    },
    noFollowRobots
);

const CohortDiscoveryPage = async () => {
    const content = await getCohortTermsAndConditions();
    const {
        template: { repeatfields },
    } = content;

    return <CohortDiscoveryCoverPage cmsContent={repeatfields} />;
};

export default CohortDiscoveryPage;
