import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";

export const metadata = metaData(
    {
        title: "Tool Create - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function ToolCreatePage() {
    const user = await getUser();

    return <CreateTool userId={user.id} />;
}
