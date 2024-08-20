import { getContentPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";

const URI = "/support/gateway-schema";

export default async function GatewaySchema() {
    const data = await getContentPageQuery("GetContentPageQuery", {
        id: URI,
    });

    return <SupportPage title={data?.title} content={data?.content} />;
}
