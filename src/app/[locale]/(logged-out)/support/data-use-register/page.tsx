import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import metaData from "@/utils/metdata";

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
