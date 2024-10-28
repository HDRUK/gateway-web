import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import TeamCollections from "../../team/[teamId]/(withLeftNav)/collections/components/TeamCollections";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Collections",
    description: "",
};

export default async function CollectionsPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamCollections permissions={permissions} userId={userId} />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
