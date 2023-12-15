import ActionBar from "@/components/ActionBar";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { cookies } from "next/headers";
import TwoColumn from "@/components/TwoColumn";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";
import LeftNav from "@/modules/LeftNav";

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
    const permissions = await getPermissions(user.roles);

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
