import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import TeamMembers from "@/modules/TeamMembers";
import AddTeamMemberDialog from "@/modules/AddTeamMemberDialog";
import Button from "@/components/Button";
import useDialog from "@/hooks/useDialog";
import AccountLayout from "@/modules/AccountLayout";
import { AddIcon } from "@/consts/icons";
import { useHasPermissions } from "@/hooks/useHasPermission";
import EmailNotifications from "@/modules/EmailNotifications";
import { useNewMembers } from "@/hooks/useNewMembers";

const TeamManagementPage = () => {
    const { showDialog } = useDialog();
    const permissions = useHasPermissions();
    const { teamMembers, onAddNewMember } = useNewMembers();

    const tabsList = [
        {
            label: "Members",
            value: "Members",
            content: (
                <Typography component="span">
                    <TeamMembers teamMembers={teamMembers} />
                </Typography>
            ),
        },
        {
            label: "Notifications",
            value: "Notifications",
            content: (
                <Typography component="span">
                    <EmailNotifications />
                </Typography>
            ),
        },
    ];

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
                                        showDialog(AddTeamMemberDialog, {
                                            onSuccess: onAddNewMember,
                                        })
                                    }>
                                    <AddIcon /> Add a new member
                                </Button>
                            )}
                        </Box>
                        <Tabs
                            centered
                            tabs={tabsList}
                            tabBoxSx={{ padding: 0 }}
                            rootBoxSx={{ padding: 0 }}
                        />
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
