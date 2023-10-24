import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import LeftNav from "@/modules/LeftNav";
import { ReactNode, useMemo } from "react";
import { getProfileNav, getTeamNav } from "@/utils/nav";
import { useRouter } from "next/router";
import { useHasPermissions } from "@/hooks/useHasPermission";
import Loading from "@/components/Loading";
import ActionBar from "@/components/ActionBar";
import Typography from "@/components/Typography";
import useGetTeam from "@/hooks/useGetTeam";

interface AccountLayoutProps {
    children: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const permissions = useHasPermissions();

    const { team, isTeamLoading } = useGetTeam(teamId);
    const isTeam = useMemo(() => !!teamId, [teamId]);

    const navItems = useMemo(() => {
        if (!teamId) return getProfileNav();
        return getTeamNav(permissions, teamId);
    }, [teamId, permissions]);

    if (isTeamLoading) {
        return <Loading />;
    }
    return (
        <div>
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 1" },
                        bgcolor: "white",
                    }}>
                    {isTeam && (
                        <BoxContainer
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                            <Box>
                                <Typography>{team?.name}</Typography>
                            </Box>
                        </BoxContainer>
                    )}
                    <LeftNav navItems={navItems} />
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    {children}
                </Box>
            </BoxContainer>
            <ActionBar />
        </div>
    );
};

export default AccountLayout;
