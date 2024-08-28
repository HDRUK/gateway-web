import { getContentPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";

const URI = "/support/data-use-register";

export default async function DataUseRegister() {
    const data = await getContentPageQuery("GetContentPageQuery", {
        id: URI,
    });

    return <SupportPage title={data?.title} content={data?.content} />;
}
