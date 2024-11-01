import { cookies } from "next/headers";
import Container from "@/components/Container";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUserFromCookie } from "@/utils/api";
import { getCohortTermsAndConditions } from "@/utils/cms";
import metaData from "@/utils/metdata";
import CohortDisoveryRequestForm from "./components/CohortDisoveryRequestForm";

export const metadata = metaData({
    title: "Cohort Discovery Request - About",
    description: "",
});
export default async function CohortDiscoryRequestPage() {
    const cookieStore = cookies();
    const user = getUserFromCookie(cookieStore);

    const content = await getCohortTermsAndConditions();

    const {
        template: { repeatfields },
    } = content;

    return (
        <ProtectedAccountRoute loggedInOnly={!!user?.id}>
            <Container>
                <CohortDisoveryRequestForm
                    userId={user?.id}
                    cmsContent={repeatfields}
                />
            </Container>
        </ProtectedAccountRoute>
    );
}
