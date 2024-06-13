"use client";

import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { useNewMembersOnTop } from "@/hooks/useNewMembersOnTop";
import { CUSTOMER_PORTAL_RAISE_SUPPORT_URL } from "@/config/hrefs";
import { AddIcon } from "@/consts/icons";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import EmailNotifications from "./EmailNotifications";
import TeamMembers from "./TeamMembers";

export default function TeamManagement({
    permissions,
    team,
}: {
    permissions: { [key: string]: boolean };
    team: Team;
}) {
    const { showDialog } = useDialog();
    const { teamMembers, onAddNewMembers } = useNewMembersOnTop(team);

    const tabsList = [
        {
            label: "Members",
            value: "members",
            content: (
                <TeamMembers
                    teamId={team.id}
                    permissions={permissions}
                    teamMembers={teamMembers}
                />
            ),
        },
        {
            label: "Notifications",
            value: "notifications",
            content: (
                <EmailNotifications team={team} permissions={permissions} />
            ),
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
                        {permissions["team-members.create"] && (
                            <Button
                                onClick={() =>
                                    showDialog(AddTeamMemberDialog, {
                                        onSuccess: onAddNewMembers,
                                        teamId: team.id,
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
