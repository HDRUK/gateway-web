"use client";

import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import TeamMembers from "@/modules/TeamMembers";
import AddTeamMemberDialog from "@/modules/AddTeamMemberDialog";
import Button from "@/components/Button";
import { AddIcon } from "@/consts/icons";
import EmailNotifications from "@/modules/EmailNotifications";
import { useNewMembersOnTop } from "@/hooks/useNewMembersOnTop";
import { CUSTOMER_PORTAL_RAISE_SUPPORT_URL } from "@/config/hrefs";
import Paper from "@/components/Paper";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useDialog from "@/hooks/useDialog";

export default function TeamManagement({
    permissions,
    teamId,
}: {
    permissions: { [key: string]: boolean };
    teamId: string;
}) {
    const { showDialog } = useDialog();
    const { teamMembers, onAddNewMembers } = useNewMembersOnTop(teamId);
    useUnsavedChanges({ shouldConfirmLeave: true });
    const tabsList = [
        {
            label: "Members",
            value: "members",
            content: (
                <TeamMembers
                    teamId={teamId}
                    permissions={permissions}
                    teamMembers={teamMembers}
                />
            ),
        },
        {
            label: "Notifications",
            value: "notifications",
            content: <EmailNotifications />,
        },
    ];

    return (
        <BoxContainer sx={{ gap: 0 }}>
            <Paper>
                <Box sx={{ bgcolor: "white", mb: 0 }}>
                    <Typography variant="h2">Team management</Typography>
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
                                        teamId,
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
    );
}
