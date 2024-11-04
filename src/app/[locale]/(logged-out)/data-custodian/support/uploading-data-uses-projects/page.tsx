import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Uploading Data Uses / Research Projects - Data Custodians",
    description: "",
});

const UploadingDataUsesProjectsPage = async () => {
    const cmsPage = await getContentPageByParentQuery(
        "UploadDataUsesProjects",
        {
            id: "uploading-data-uses-research-projects",
            idType: "URI",
            parentId: "/data-custodian-support",
        }
    );

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default UploadingDataUsesProjectsPage;
