import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Researcher FAQs - Support",
    description: "",
});

export default async function ResearcherFAQs() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "researcher-faqs",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
