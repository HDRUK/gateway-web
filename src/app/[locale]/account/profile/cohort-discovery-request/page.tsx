import CtaOverride from "@/components/CtaOverride";
import { getCohortDiscovery1 } from "@/utils/cms";
import metaData, { noFollowRobots } from "@/utils/metadata";
import CohortDiscoveryCoverPage from "./components/CohortDiscoveryCoverPage/CohortDiscoveryCoverPage";

export const metadata = metaData(
    {
        title: "CohortDiscovery",
        description: "",
    },
    noFollowRobots
);

const CohortDiscoveryPage = async () => {
    const cohortDiscovery = await getCohortDiscovery1();

    return (
        <CohortDiscoveryCoverPage
            cohortDiscovery={cohortDiscovery}
            ctaOverrideComponent={
                cohortDiscovery?.template.newCohortDiscoveryFieldGroup
                    .ctaLink && (
                    <CtaOverride
                        ctaLink={
                            cohortDiscovery?.template
                                .newCohortDiscoveryFieldGroup.ctaLink
                        }
                    />
                )
            }></CohortDiscoveryCoverPage>
    );
};

export default CohortDiscoveryPage;
