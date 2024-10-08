import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodians - Onboarding to Cohort Discovery",
    description: "",
};

const CohortDiscoveryPage = async () => {
    const cmsPage = await getContentPageByParentQuery("CohortDiscovery", {
        id: "onboarding-to-cohort-discovery",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default CohortDiscoveryPage;
