import { notFound } from "next/navigation";
import { getCohortDiscoverySupportPageQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import SupportPage from "../components/SupportPage";
import Documentation from "./components/Documentation";
import Explainer from "./components/Explainer";
import FAQs from "./components/FAQs";

export const metadata = metaData({
    title: "Cohort Discovery - Support",
    description: "",
});

export default async function CohortDiscovery() {
    const data = await getCohortDiscoverySupportPageQuery();

    if (!data) {
        notFound();
    }

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
