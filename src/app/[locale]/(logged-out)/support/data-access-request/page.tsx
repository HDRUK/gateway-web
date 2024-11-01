import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import metaData from "@/utils/metdata";

export const metadata = metaData({
    title: "Data Access Request - Support",
    description: "",
});

export default async function DataAccessRequest() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "data-access-request",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
