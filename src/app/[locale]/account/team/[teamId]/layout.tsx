import { cookies } from "next/headers";
import ActionBar from "@/components/ActionBar";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import TwoColumn from "@/components/TwoColumn";
import Typography from "@/components/Typography";
import LeftNav from "@/modules/LeftNav";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export default async function AccountTeamLayout({
    children,
    params,
}: {
    params: { teamId: string };
    children: React.ReactNode;
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const foundUser = getTeamUser(team?.users, user?.id);
    const permissions = await getPermissions(user.roles, foundUser?.roles);

    return (
        <div>
            <TwoColumn
                leftContent={
                    <>
                        <BoxContainer
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                            <Box>
                                <Typography>{team?.name}</Typography>
                            </Box>
                        </BoxContainer>

                        <LeftNav teamId={teamId} permissions={permissions} />
                    </>
                }
                rightContent={children}
            />
            <ActionBar />
        </div>
    );
}
