import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Collections - Support",
    description: "",
});

export default async function Collections() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "exploring-collections-data-custodians-and-data-custodian-networks",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
