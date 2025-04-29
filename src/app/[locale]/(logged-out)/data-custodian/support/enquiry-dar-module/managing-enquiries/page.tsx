import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import notFound from "@/app/not-found";
import SupportPage from "../../components/SupportPage";

export const metadata = metaData({
    title: "Receiving and managing enquiries - Support",
    description: "",
});

export default async function DataAccessRequest() {
    const cmsPage = await getContentPageByParentQuery("GetContentPageQuery", {
        id: "receiving-and-managing-enquiries",
        idType: "URI",
        parentId:
            "/data-custodian-support/using-the-gateway-enquiry-data-access-request-module",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
}
