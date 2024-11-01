import CMSPromoTemplate from "@/components/CMSPromoTemplate";
import Container from "@/components/Container";
import { getCohortDiscovery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import CtaOverride from "./components/CtaOverride";

export const metadata = metaData({
    title: "Cohort Discovery - About",
    description: "",
});

export default async function CohortDiscoryPage() {
    const cohortDiscovery = await getCohortDiscovery();

    return (
        <Container>
            <CMSPromoTemplate
                content={cohortDiscovery}
                ctaOverrideComponent={
                    cohortDiscovery.template.promofields?.ctaLink && (
                        <CtaOverride
                            ctaLink={
                                cohortDiscovery.template.promofields.ctaLink
                            }
                        />
                    )
                }
            />
        </Container>
    );
}
