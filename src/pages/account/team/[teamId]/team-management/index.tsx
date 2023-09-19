import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import { Typography } from "@mui/material";
import TeamManagementTabs from "@/modules/TeamManagement/TeamManagementTabs";
import AddTeamMemberDialog from "@/modules/dialogs/AddTeamMemberDialog";
import Button from "@/components/Button";

import useDialog from "@/hooks/useDialog";
import AccountLayout from "@/modules/AccountLayout";
import { AddIcon } from "@/consts/icons";

const TeamManagementPage = () => {
    const { showDialog } = useDialog();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Team Management" />
            <AccountLayout>
                <BoxContainer>
                    <Box sx={{ bgcolor: "white" }}>
                        <Typography variant="h2">Team management</Typography>
                        <Typography>
                            Organise and manage team members and the teams email
                            notifications.
                        </Typography>
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
                        <TeamManagementTabs />
                    </Box>
                </BoxContainer>
            </AccountLayout>
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

export default TeamManagementPage;
