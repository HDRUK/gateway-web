"use client";

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
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const reindex = usePost<{ entity: string }>(apis.adminSearchReindexV1Url, {
        successNotificationsOn: false,
    });

    const handleConfirm = async () => {
        const result = await reindex({ entity });
        hideDialog();

        if (result) {
            notificationService.success(
                `Reindex queued for "${collection}". This runs in the background — refresh the status table in a few minutes to see updated counts.`
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
        <Dialog title="Reindex search collection" showCloseButton={false}>
            <MuiDialogContent>
                <Typography sx={{ mb: isLarge ? 2 : 0 }}>
                    This will drop and recreate the &quot;{collection}&quot;
                    Typesense collection and re-import all records from the
                    database. This is a heavy, asynchronous operation and
                    cannot be undone. Are you sure you want to continue?
                </Typography>
                {isLarge && (
                    <Typography color="warning.main">
                        This is a large entity — the full re-import can take
                        a minute or two to complete.
                    </Typography>
                )}
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    Cancel
                </Button>

                <Button color="error" onClick={handleConfirm}>
                    Reindex
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default ReindexConfirmDialog;
