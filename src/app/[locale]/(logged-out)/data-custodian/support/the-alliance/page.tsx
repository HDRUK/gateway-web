import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "The Alliance - Data Custodians",
    description: "",
});

const TheAlliancePage = async () => {
    const cmsPage = await getContentPageByParentQuery("TheAlliance", {
        id: "the-alliance",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default TheAlliancePage;
