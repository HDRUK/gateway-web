"use client";

import { useTranslations } from "next-intl";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import usePost from "@/hooks/usePost";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import notificationService from "@/services/notification";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.ReindexConfirmDialog";

interface ReindexConfirmDialogProps {
    entity: string;
    collection: string;
    isLarge?: boolean;
    callback?: () => void;
}

const ReindexConfirmDialog = ({
    entity,
    collection,
    isLarge,
    callback,
}: ReindexConfirmDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const reindex = usePost<{ entity: string }>(apis.adminSearchReindexV1Url, {
        successNotificationsOn: false,
    });

    const handleConfirm = async () => {
        const result = await reindex({ entity });
        hideDialog();

        if (result) {
            notificationService.success(
                t("queuedNotification", { COLLECTION: collection })
            );

            if (typeof callback === "function") {
                callback();
            }
        }
    };

    const onCancel = () => {
        hideDialog();
    };

    return (
        <Dialog title={t("title")} showCloseButton={false}>
            <MuiDialogContent>
                <Typography sx={{ mb: isLarge ? 2 : 0 }}>
                    {t("message", { COLLECTION: collection })}
                </Typography>
                {isLarge && (
                    <Typography color="warning.main">
                        {t("largeEntityWarning")}
                    </Typography>
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

                <Button color="error" onClick={handleConfirm}>
                    {t("confirmButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default ReindexConfirmDialog;
