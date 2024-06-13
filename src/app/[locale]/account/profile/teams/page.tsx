import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import Teams from "./teams";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Teams",
    description: "",
};

export default async function TeamsPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["custodians.read"]}>
            <Teams permissions={permissions} />
        </ProtectedAccountRoute>
    );
}
