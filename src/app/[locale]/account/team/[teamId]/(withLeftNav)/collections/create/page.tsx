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
        title: "Create Collection - My Account",
        description: "Create a collection",
    },
    noFollowRobots
);
export default async function CollectionCreatePage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
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
            pagePermissions={["collections.create"]}>
            <CollectionForm teamId={teamId} keywordOptions={keywordOptions} />
        </ProtectedAccountRoute>
    );
}
