"use client";

import * as React from "react";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

interface DeleteTeamMemberDialogProps {
    teamId: number;
    teamName: string;
    callback: () => void;
}

const TRANSLATION_PATH = "modules.dialogs.DeleteTeamDialog";

const DeleteTeamMemberDialog = ({
    teamId,
    teamName,
    callback,
}: DeleteTeamMemberDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteTeam = useDelete(`${apis.teamsV1Url}`, {
        itemName: `Team`,
    });

    const handleDelete = async () => {
        await deleteTeam(teamId);
        hideDialog();

        if (typeof callback === "function") {
            callback();
        }
    };

    const onCancel = () => {
        hideDialog();
    };

    return (
        <Dialog title={t("title")} showCloseButton={false}>
            <MuiDialogContent>
                <Typography>{t("message", { TEAM_NAME: teamName })}</Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    {t("cancelButton") || ""}
                </Button>

                <Button onClick={handleDelete}>
                    {t("confirmButton") || ""}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DeleteTeamMemberDialog;
