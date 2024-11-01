import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metdata";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";

export const metadata = metaData(
    {
        title: "Tool Create - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function ToolCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);

    return <CreateTool userId={user.id} />;
}
