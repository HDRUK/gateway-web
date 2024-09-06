import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Tool Edit",
    description: "",
};

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
