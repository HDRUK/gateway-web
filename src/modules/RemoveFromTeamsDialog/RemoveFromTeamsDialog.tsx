"use client";

import { useState } from "react";
import { Button } from "@hdruk/ui";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { UserPickerTeam } from "@/interfaces/AdminUser";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.RemoveFromTeamsDialog";

interface RemoveFromTeamsDialogProps {
    userId: number;
    userName: string;
    teams: UserPickerTeam[];
    onRemoved: (removedTeamIds: number[]) => void;
}

interface RemoveFromTeamsPayload {
    team_ids: number[];
}

const RemoveFromTeamsDialog = ({
    userId,
    userName,
    teams,
    onRemoved,
}: RemoveFromTeamsDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const removeFromTeams = usePost<RemoveFromTeamsPayload>(
        `${apis.adminUsersV1Url}/${userId}/remove-from-teams`,
        { successNotificationsOn: false }
    );

    const toggleTeam = (teamId: number) => {
        setSelectedTeamIds(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const onCancel = () => hideDialog();

    const handleConfirm = async () => {
        setSubmitting(true);
        const result = await removeFromTeams({ team_ids: selectedTeamIds });
        setSubmitting(false);

        if (result !== null) {
            notificationService.success(
                t("success", {
                    USER_NAME: userName,
                    COUNT: selectedTeamIds.length,
                })
            );
            hideDialog();
            onRemoved(selectedTeamIds);
        }
    };

    return (
        <Dialog title={t("title")} showCloseButton={false} maxWidth="sm">
            <MuiDialogContent>
                <Typography sx={{ mb: 2 }}>
                    {t("intro", { USER_NAME: userName })}
                </Typography>

                {teams.length === 0 && <Typography>{t("noTeams")}</Typography>}

                {teams.length > 0 && (
                    <FormGroup>
                        {teams.map(team => (
                            <FormControlLabel
                                key={team.id}
                                control={
                                    <Checkbox
                                        checked={selectedTeamIds.includes(
                                            team.id
                                        )}
                                        onChange={() => toggleTeam(team.id)}
                                    />
                                }
                                label={team.name}
                            />
                        ))}
                    </FormGroup>
                )}
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    {t("cancelButton")}
                </Button>
                <Button
                    color="error"
                    onClick={handleConfirm}
                    disabled={submitting || selectedTeamIds.length === 0}>
                    {t("confirmButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default RemoveFromTeamsDialog;
