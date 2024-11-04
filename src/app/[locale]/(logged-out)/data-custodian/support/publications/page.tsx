import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Publications - Data Custodians",
    description: "",
});

export default async function PublicationsPage() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "uploading-publications",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
