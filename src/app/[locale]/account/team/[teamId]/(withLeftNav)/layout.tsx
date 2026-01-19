import { cookies } from "next/headers";
import ActionBar from "@/components/ActionBar";
import TwoColumn from "@/components/TwoColumn";
import LeftNav from "@/modules/LeftNav";
import config from "@/config/config";
import { getTeam, getUser } from "@/utils/api";
import { checkLeftNavCookie } from "@/utils/cookies";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export default async function AccountTeamLayout({
    children,
    params,
}: {
    params: Promise<{ teamId: string }>;
    children: React.ReactNode;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const foundUser = getTeamUser(team?.users, user?.id);
    const permissions = await getPermissions(user.roles, foundUser?.roles);
    const cookieStore = await cookies();

    return (
        <>
            <TwoColumn
                leftContent={
                    <LeftNav
                        teamId={teamId}
                        permissions={permissions}
                        navHeading={team.name}
                        initialLeftNavOpen={
                            cookieStore.get(config.LEFT_NAV_COOKIE)?.value ===
                            "true"
                        }
                        initialExpandLeftNav={
                            !(
                                cookieStore.get(config.EXPAND_LEFT_NAV)
                                    ?.value === "false"
                            )
                        }
                    />
                }
                rightContent={children}
            />
            <ActionBar />
        </>
    );
}
