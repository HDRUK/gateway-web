import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Onboarding to Cohort Discovery - Data Custodians",
    description: "",
});
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
