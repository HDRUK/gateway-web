import { cookies } from "next/headers";
import { ValueType } from "@/components/Autocomplete/Autocomplete";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getKeywords, getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = metaData(
    {
        title: "Edit Collection - My Account",
        description: "Edit a collection",
    },
    noFollowRobots
);
export default async function CollectionEditPage({
    params,
}: {
    params: { teamId: string; collectionId: string };
}) {
    const { teamId, collectionId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const keywords = await getKeywords(cookieStore);
    const keywordOptions = keywords.map(data => {
        return {
            value: data.id as ValueType,
            label: data.name,
        };
    });
    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.update"]}>
            <CollectionForm
                teamId={teamId}
                collectionId={collectionId}
                keywordOptions={keywordOptions}
            />
        </ProtectedAccountRoute>
    );
}
