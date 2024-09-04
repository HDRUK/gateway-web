import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateTool from "../../../team/[teamId]/(withLeftNav)/tools/create/components/CreateTool";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Tool Create",
    description: "",
};

export default async function ToolCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["tools.create"]}>
            <CreateTool userId={user.id} />
        </ProtectedAccountRoute>
    );
}
