"use client";

// todo: To be removed as part of migration to AppRouter
import { ReactNode, useMemo } from "react";
import { useParams } from "next/navigation";
import ActionBar from "@/components/ActionBar";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import LeftNav from "@/modules/LeftNav";
import useGetTeam from "@/hooks/useGetTeam";
import { useHasPermissions } from "@/hooks/useHasPermission";

interface AccountLayoutProps {
    children: ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
    const params = useParams<{ teamId: string }>();

    const permissions = useHasPermissions();
    const { team, isTeamLoading } = useGetTeam(params?.teamId);
    const isTeam = useMemo(() => !!params?.teamId, [params?.teamId]);

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
                    <LeftNav
                        permissions={permissions}
                        teamId={params?.teamId}
                    />
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
