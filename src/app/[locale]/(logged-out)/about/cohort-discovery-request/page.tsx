import Container from "@/components/Container";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUserFromCookie } from "@/utils/api";
import { getCohortTermsAndConditions } from "@/utils/cms";
import metaData from "@/utils/metadata";
import CohortDiscoveryRequestForm from "./components/CohortDiscoveryRequestForm";

export const metadata = metaData({
    title: "Cohort Discovery Request - About",
    description: "",
});

//why is this in (logged-out) - it's a protected page?
export default async function CohortDiscoryRequestPage() {
    const user = await getUserFromCookie();

    const content = await getCohortTermsAndConditions();

    const {
        template: { repeatfields },
    } = content;

    return (
        <ProtectedAccountRoute loggedInOnly={!!user?.id}>
            <Container>
                <CohortDiscoveryRequestForm
                    userId={user?.id}
                    cmsContent={repeatfields}
                />
            </Container>
        </ProtectedAccountRoute>
    );
}
