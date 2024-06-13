"use client";

import * as React from "react";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { User } from "@/interfaces/User";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

interface DeleteTeamMemberDialogProps {
    user: User;
    callback: () => void;
}

const DeleteTeamMemberDialog = ({
    user,
    callback,
}: DeleteTeamMemberDialogProps) => {
    const params = useParams<{ teamId: string }>();
    const t = useTranslations("modules");
    const title = t("dialogs.DeleteTeamMemberDialog.title");
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteTeamMember = useDelete(
        `${apis.teamsV1Url}/${params?.teamId}/users/${user.id}`,
        {
            itemName: `User`,
        }
    );

    const handleDelete = () => {
        deleteTeamMember(user.id);
        hideDialog();

        if (typeof callback === "function") {
            callback();
        }
    };

    const onCancel = () => {
        hideDialog();
    };

    return (
        <Dialog title="Delete a user" showCloseButton={false}>
            <MuiDialogContent>
                <Typography>
                    {title.replace("%%USER_NAME%%", user.name)}
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    {t("dialogs.DeleteTeamMemberDialog.cancelButton") || ""}
                </Button>

                <Button onClick={handleDelete}>
                    {t("dialogs.DeleteTeamMemberDialog.confirmButton") || ""}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DeleteTeamMemberDialog;
