"use client";

import { useTranslations } from "next-intl";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.DeleteEmailTemplateDialog";

interface DeleteEmailTemplateDialogProps {
    templateId: number;
    templateIdentifier: string;
    callback?: () => void;
}

const DeleteEmailTemplateDialog = ({
    templateId,
    templateIdentifier,
    callback,
}: DeleteEmailTemplateDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteTemplate = useDelete(apis.emailTemplatesV1Url, {
        itemName: "Email Template",
    });

    const handleDelete = async () => {
        const result = await deleteTemplate(templateId);
        hideDialog();

        if (result && typeof callback === "function") {
            callback();
        }
    };

    const onCancel = () => {
        hideDialog();
    };

    return (
        <Dialog title={t("title")} showCloseButton={false}>
            <MuiDialogContent>
                <Typography>
                    {t("message", { IDENTIFIER: templateIdentifier })}
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    {t("cancelButton")}
                </Button>
                <Button color="error" onClick={handleDelete}>
                    {t("confirmButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DeleteEmailTemplateDialog;
