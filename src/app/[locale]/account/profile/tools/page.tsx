import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import Tools from "../../team/[teamId]/(withLeftNav)/tools/components/TeamTools";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Tools",
    description: "",
};

export default async function TeamsPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    // manually add tools permissions for individual users so that they have permissions on their owned tools.
    ["tools.update", "tools.delete"].forEach(value => {
        permissions[value] = true;
    });

    return <Tools permissions={permissions} userId={userId} />;
}
