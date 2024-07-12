import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import Tools from "../../team/[teamId]/(withLeftNav)/tools/components/TeamTools";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Tools",
    description: "",
};

export default async function TeamsPage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return <Tools permissions={permissions} teamId={teamId} userId={userId} />;
}
