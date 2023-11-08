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
import { useNewMembersOnTop } from "@/hooks/useNewMembersOnTop";
import { CUSTOMER_PORTAL_RAISE_SUPPORT_URL } from "@/config/hrefs";
import Paper from "@/components/Paper";

const TeamManagementPage = () => {
    const { showDialog } = useDialog();
    const permissions = useHasPermissions();
    const { teamMembers, onAddNewMembers } = useNewMembersOnTop();

    const tabsList = [
        {
            label: "Members",
            value: "members",
            content: <TeamMembers teamMembers={teamMembers} />,
        },
        {
            label: "Notifications",
            value: "notifications",
            content: <EmailNotifications />,
        },
    ];

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Team Management" />
            <AccountLayout>
                <BoxContainer sx={{ gap: 0 }}>
                    <Paper>
                        <Box sx={{ bgcolor: "white", mb: 0 }}>
                            <Typography variant="h2">
                                Team management
                            </Typography>
                            <Typography>
                                Organise and manage team members and email
                                notifications. If you need assistance, please{" "}
                                <a
                                    target="_blank"
                                    href={CUSTOMER_PORTAL_RAISE_SUPPORT_URL}
                                    rel="noreferrer">
                                    raise a support ticket
                                </a>
                                .
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
                                                onSuccess: onAddNewMembers,
                                            })
                                        }>
                                        <AddIcon /> Add a new member
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                    <Tabs
                        centered
                        tabs={tabsList}
                        tabBoxSx={{ padding: 0 }}
                        rootBoxSx={{ padding: 0 }}
                    />
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
