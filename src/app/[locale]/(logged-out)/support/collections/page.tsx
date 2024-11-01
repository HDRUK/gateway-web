import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import metaData from "@/utils/metdata";


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
