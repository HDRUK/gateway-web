import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import LeftNav from "@/modules/LeftNav";
import { ReactNode, useMemo } from "react";
import { Typography } from "@mui/material";
import { getProfileNav, getTeamNav } from "@/utils/nav";
import { useRouter } from "next/router";
import useCustodianRoles from "@/hooks/useCustodianRoles";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Team } from "@/interfaces/Team";
import Loading from "../Loading";

interface AccountLayoutProps {
    children: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
    const { query } = useRouter();

    const { teamId } = query as AccountTeamUrlQuery;
    const roles = useCustodianRoles(teamId);
    const { data: team, isLoading: isTeamLoading } = useGet<Team>(
        `${apis.teamsV1Url}/${teamId}`,
        { shouldFetch: !!teamId }
    );
    const isTeam = useMemo(() => !!teamId, [teamId]);

    const navItems = useMemo(() => {
        if (!teamId) return getProfileNav();
        return getTeamNav(roles, teamId);
    }, [teamId, roles]);

    if (isTeamLoading) {
        return <Loading />;
    }
    return (
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
            <Box sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                {children}
            </Box>
        </BoxContainer>
    );
};

export default AccountLayout;
