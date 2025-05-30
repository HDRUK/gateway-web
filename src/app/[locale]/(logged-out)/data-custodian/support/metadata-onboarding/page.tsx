import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Metadata Onboarding - Data Custodians",
    description: "",
});

const MetadataOnboardingPage = async () => {
    const cmsPage = await getContentPageByParentQuery("MetadataOnboarding", {
        id: "data-custodian-metadata-onboarding",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default MetadataOnboardingPage;
