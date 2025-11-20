import BoxContainer from "@/components/BoxContainer";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import TeamCollections from "../../team/[teamId]/(withLeftNav)/collections/components/TeamCollections";

export const metadata = metaData(
    {
        title: "Collections - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function CollectionsPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <BoxContainer sx={{ gap: 0 }}>
            <TeamCollections permissions={permissions} userId={userId} />
        </BoxContainer>
    );
}
