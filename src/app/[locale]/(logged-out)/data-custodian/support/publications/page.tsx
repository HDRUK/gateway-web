import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import metaData from "@/utils/metdata";

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
