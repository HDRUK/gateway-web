import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import TeamManagementTabs from "@/modules/TeamManagementTabs";
import AddTeamMemberDialog from "@/modules/AddTeamMemberDialog";
import Button from "@/components/Button";

import useDialog from "@/hooks/useDialog";
import AccountLayout from "@/modules/AccountLayout";
import { AddIcon } from "@/consts/icons";
import Typography from "@/components/Typography";
import { useHasPermissions } from "@/hooks/useHasPermission";

const TeamManagementPage = () => {
    const { showDialog } = useDialog();
    const permissions = useHasPermissions();
    console.log("permissions: ", permissions);
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
                            {permissions[
                                "fe.account.team_management.member.add"
                            ] && (
                                <Button
                                    onClick={() =>
                                        showDialog(AddTeamMemberDialog)
                                    }>
                                    <AddIcon /> Add a new member
                                </Button>
                            )}
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
