import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import notFound from "@/app/not-found";
import SupportPage from "../../components/SupportPage";

export const metadata = metaData({
    title: "Managing your Data Access Request Form - Support",
    description: "",
});

export default async function DataAccessRequest() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "managing-your-data-access-request-form",
        idType: "URI",
        parentId:
            "/data-custodian-support/using-the-gateway-enquiry-data-access-request-module",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
