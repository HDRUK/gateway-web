import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Getting started on the Gateway and managing your Team - Data Custodian",
    description: "",
});

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
