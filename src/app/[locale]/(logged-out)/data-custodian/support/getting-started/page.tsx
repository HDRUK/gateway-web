import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodians - Getting started on the Gateway and managing your Team",
    description: "",
};

const GettingStartedPage = async () => {
    const cmsPage = await getContentPageByParentQuery("GettingStarted", {
        id: "getting-started",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default GettingStartedPage;
