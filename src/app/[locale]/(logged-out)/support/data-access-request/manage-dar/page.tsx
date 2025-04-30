import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import notFound from "@/app/not-found";
import SupportPage from "../../components/SupportPage";

export const metadata = metaData({
    title: "Managing your Data Access Requests - Support",
    description: "",
});

export default async function DataAccessRequest() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "managing-your-data-access-requests",
        idType: "URI",
        parentId: "/support/data-access-request",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
