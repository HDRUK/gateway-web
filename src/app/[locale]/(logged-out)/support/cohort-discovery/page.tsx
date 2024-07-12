import { getCohortDiscoverySupportPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import Documentation from "./components/Documentation";
import Explainer from "./components/Explainer";
import FAQs from "./components/FAQs";

export default async function CohortDiscovery() {
    const data = await getCohortDiscoverySupportPageQuery();

    const {
        supportCohortDiscovery: { documentation, faqs, explainer },
    } = data;

    return (
        <SupportPage title={data?.title}>
            {explainer?.node.sourceUrl && (
                <Explainer src={explainer?.node.sourceUrl} />
            )}
            {documentation && <Documentation content={documentation} />}
            {faqs && <FAQs data={faqs} />}
        </SupportPage>
    );
}
