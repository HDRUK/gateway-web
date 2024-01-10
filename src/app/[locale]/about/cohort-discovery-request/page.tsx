import Container from "@/components/Container";
import { getCohortTermsAndConditions } from "@/utils/cms";
import CohortDisoveryRequestForm from "./components/CohortDisoveryRequestForm";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Cohort Discovery Request",
    description: "",
};

export default async function CohortDiscoryRequestPage() {
    const content = await getCohortTermsAndConditions();
    const {
        template: { repeatFields },
    } = content;
    return (
        <Container>
            <CohortDisoveryRequestForm cmsContent={repeatFields} />
        </Container>
    );
}
