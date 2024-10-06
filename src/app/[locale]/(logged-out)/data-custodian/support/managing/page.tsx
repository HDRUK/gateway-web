import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodians - Managing Collections, Data Custodians and Data Custodian Networks",
    description: "",
};

const ManagingPage = async () => {
    const cmsPage = await getContentPageByParentQuery("Managing", {
        id: "managing-collections-data-custodians-and-data-custodian-networks",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default ManagingPage;
