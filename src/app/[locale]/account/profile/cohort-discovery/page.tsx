import CohortDiscoveryInfo from "@/components/CohortDiscoveryInfo";
import { getCohortDiscovery1 } from "@/utils/cms";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Cohort Discovery - About",
    description: "",
});

export default async function CohortDiscoveryPage() {
    const cohortDiscovery = await getCohortDiscovery1();

    return <CohortDiscoveryInfo cohortDiscovery={cohortDiscovery} />;
}
