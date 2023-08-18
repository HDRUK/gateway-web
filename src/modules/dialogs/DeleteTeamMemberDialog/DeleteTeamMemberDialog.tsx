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

const DeleteTeamMemberDialog = (user: User, callback: Function) => {
    const router = useRouter();
    const { teamId } = router.query;
    const { t } = useTranslation("modules");
    const title = t("dialogs.DeleteTeamMemberDialog.title");
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteTeamMember = useDelete(
        `${apis.teamsV1Url}/${teamId}/users/${user.user.id}`,
        {
            itemName: `User`,
        },
        true
    );

    const handleDelete = () => {
        deleteTeamMember(user.user.id);
        hideDialog();

        if (typeof callback === "function") {
            callback();
        }
    };

    const onCancel = () => {
        hideDialog();
    };

    return (
        <Dialog title="" showCloseButton={false}>
            <MuiDialogContent
                sx={{
                    textAlign: "center",
                    fontSize: "14pt",
                    padding: 5,
                    marginTop: 5,
                }}>
                {title.replace(
                    "%%USER_NAME%%",
                    // eslint-disable-next-line react/destructuring-assignment
                    user.user.name
                )}
            </MuiDialogContent>
            <MuiDialogActions
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 5,
                }}>
                <Button autoFocus onClick={onCancel}>
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
