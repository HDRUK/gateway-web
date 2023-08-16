import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import LeftNav from "@/modules/LeftNav";

import Link from "@/components/Link";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import TeamManagementTabs from "@/modules/TeamManagement/TeamManagementTabs";
import AddTeamMemberDialog from "@/modules/dialogs/AddTeamMemberDialog";
import Button from "@/components/Button";

import AddIcon from "@mui/icons-material/Add";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import { Team } from "@/interfaces/Team";

const TeamLandingPage = () => {
    const router = useRouter();
    const { teamId } = router.query;
    const { showDialog } = useDialog();

    const { data: teamUserList = [], isLoading: isTeamListLoading } = useGet<
        Team[]
    >(`${apis.teamsV1Url}/${teamId}`);

    if (isTeamListLoading) return <Loading />;

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Team Management" />
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
                            Organise and manage team members and the teams email
                            notifications. If you need assistance managing the
                            team, please{" "}
                            <Link href="https://www.google.com/">
                                raise a support ticket (!! NEEDS SUPPORT LINK
                                HERE !!)
                            </Link>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                            <Button
                                onClick={() => showDialog(AddTeamMemberDialog)}>
                                <AddIcon /> Add a new member
                            </Button>
                        </Box>
                        <Box>
                            <TeamManagementTabs users={teamUserList} />
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
