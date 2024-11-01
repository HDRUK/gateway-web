import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Tool Edit - My Account",
    description: ""
}, noFollowRobots);
export default async function ToolCreatePage({
    params,
}: {
    params: { toolId: string };
}) {
    const { toolId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);

    return <CreateTool userId={user.id} toolId={toolId} />;
}
