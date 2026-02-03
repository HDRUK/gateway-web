import CtaOverride from "@/components/CtaOverride";
import { getNewCohortDiscovery } from "@/utils/cms";
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
    const cohortDiscovery = await getNewCohortDiscovery();

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
            }
        />
    );
};

export default CohortDiscoveryPage;
