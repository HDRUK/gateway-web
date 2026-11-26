import { notFound } from "next/navigation";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import {
    isCollaborativeMetadataOnboardingEnabled,
    isSchemaOnboardingFormEnabled,
} from "@/flags";
import ShareTokensManager from "./components/ShareTokensManager";

export const metadata = metaData(
    {
        title: "Collaborative dataset onboarding links - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function ShareTokensPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;

    const collabEnabled = await isCollaborativeMetadataOnboardingEnabled();
    if (!collabEnabled) {
        return notFound();
    }

    // Links open the schema-driven form, so only mint them while it's on;
    // listing and revoking existing links always stays available.
    const canCreateLinks = await isSchemaOnboardingFormEnabled();

    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <ShareTokensManager
                    permissions={permissions}
                    teamId={teamId}
                    canCreateLinks={canCreateLinks}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
