import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodians - Support - Uploading Data Uses / Research Projects",
    description: "",
};

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
