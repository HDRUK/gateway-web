import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodian - Metadata Onboarding",
    description: "",
};

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
