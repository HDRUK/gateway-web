import { getContentPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";

const URI = "/support/data-access-request";

export default async function DataAccessRequest() {
    const data = await getContentPageQuery("GetContentPageQuery", {
        id: URI,
    });

    return <SupportPage title={data?.title} content={data?.content} />;
}
