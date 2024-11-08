import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Data Use Register - Support",
    description: "",
});

export default async function DataUseRegister() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "data-use-register",
        idType: "URI",
        parentId: "/support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
