import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";
import SupportPage from "../../components/SupportPage";

export const metadata = metaData({
    title: "Managing Collections, Data Custodians and Data Custodian Networks - Data Custodians",
    description: "",
});

const ManagingPage = async () => {
    const cmsPage = await getContentPageByParentQuery("Managing", {
        id: "manual-metadata-onboarding",
        idType: "URI",
        parentId: "/data-custodian-support/data-custodian-metadata-onboarding",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default ManagingPage;
