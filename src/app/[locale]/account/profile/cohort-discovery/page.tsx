import CohortDiscoveryInfo from "@/components/CohortDiscoveryInfo";
import { getNewCohortDiscovery } from "@/utils/cms";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Cohort Discovery - About",
    description: "",
});

export default async function CohortDiscoveryPage() {
    const cohortDiscovery = await getNewCohortDiscovery();

    return <CohortDiscoveryInfo cohortDiscovery={cohortDiscovery} />;
}
