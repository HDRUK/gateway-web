import Container from "@/components/Container";
import CohortDisoveryRequestForm from "./components/CohortDisoveryRequestForm";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Cohort Discovery Request",
    description: "",
};

export default async function CohortDiscoryRequestPage() {
    return (
        <Container>
            <CohortDisoveryRequestForm />
        </Container>
    );
}
