import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";
import CreateCollection from "../../../team/[teamId]/(withLeftNav)/collections/create/components/CreateTool";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Tool Create",
    description: "",
};

export default async function ToolCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);

    return <CreateCollection userId={user.id} />;
}
