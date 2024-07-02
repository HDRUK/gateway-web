import { getContentPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";

export const URI = "/support/team-management";

export default async function TeamManagement() {
    const data = await getContentPageQuery("GetContentPageQuery", {
        id: URI,
    });

    return <SupportPage title={data?.title} content={data?.content} />;
}
