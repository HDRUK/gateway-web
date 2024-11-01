import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import metaData from "@/utils/metdata";

export const metadata = metaData({
    title: "Tools - Support",
    description: "",
});

export default async function Tools() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "tools",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
