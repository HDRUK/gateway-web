import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";

export const metadata = metaData(
    {
        title: "Tool Edit - My Account",
        description: "",
    },
    noFollowRobots
);
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
