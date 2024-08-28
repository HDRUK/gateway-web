import { getContentPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";

const URI = "/support/tools";

export default async function Tools() {
    const data = await getContentPageQuery("GetContentPageQuery", {
        id: URI,
    });

    return <SupportPage title={data?.title} content={data?.content} />;
}
