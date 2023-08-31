import * as React from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import apis from "@/config/apis";
import Button from "@/components/Button";
import { User } from "@/interfaces/User";
import { useRouter } from "next/router";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/Dialog/DialogProvider";
import useDelete from "@/hooks/useDelete";
import { Typography } from "@mui/material";

interface DeleteTeamMemberDialogProps {
    user: User;
    callback: () => void;
}

const DeleteTeamMemberDialog = ({
    user,
    callback,
}: DeleteTeamMemberDialogProps) => {
    const router = useRouter();
    const { teamId } = router.query;
    const { t } = useTranslation("modules");
    const title = t("dialogs.DeleteTeamMemberDialog.title");
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteTeamMember = useDelete(
        `${apis.teamsV1Url}/${teamId}/users/${user.id}`,
        {
            itemName: `User`,
            overideUrl: true,
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
