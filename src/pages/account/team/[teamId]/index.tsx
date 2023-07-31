import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import LeftNav from "@/modules/LeftNav";

import Link from "@/components/Link";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import TeamManagementTabs from "@/modules/TeamManagementTabs";

const TeamLandingPage = () => {
    const router = useRouter();
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - App Registration" />
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
                    }}>
                    <LeftNav teamId={router.query.teamId} />
                </Box>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 3", laptop: "span 4" },
                    }}>
                    <BoxContainer>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "14pt",
                                }}>
                                Team management
                            </Typography>
                        </Box>
                        <Box>
                            Organise and manage team members and the teams email notifications.
                        </Box>
                        <Box>
                            <TeamManagementTabs />
                        </Box>
                    </BoxContainer>
                </Box>
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default TeamLandingPage;
