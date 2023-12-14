import Container from "@/components/Container";
import CMSPageTemplate1 from "@/components/CMSPageTemplate1";
import { getCohortDiscovery } from "@/utils/cms";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Cohort Discovery",
    description: "",
};

export default async function CohortDiscoryPage() {
    const cohortDiscovery = await getCohortDiscovery();

    return (
        <Container>
            <CMSPageTemplate1 content={cohortDiscovery} />
        </Container>
    );
}
