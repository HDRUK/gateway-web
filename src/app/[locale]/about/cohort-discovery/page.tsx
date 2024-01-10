import CMSPageTemplate1 from "@/components/CMSPageTemplate1";
import Container from "@/components/Container";
import { getCohortDiscovery } from "@/utils/cms";
import CtaOverride from "./components/CtaOverride";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Cohort Discovery",
    description: "",
};

export default async function CohortDiscoryPage() {
    const cohortDiscovery = await getCohortDiscovery();

    return (
        <Container>
            <CMSPageTemplate1
                content={cohortDiscovery}
                ctaOverrideComponent={
                    cohortDiscovery.template.template1Fields.ctaLink && (
                        <CtaOverride
                            ctaLink={
                                cohortDiscovery.template.template1Fields.ctaLink
                            }
                        />
                    )
                }
            />
        </Container>
    );
}
