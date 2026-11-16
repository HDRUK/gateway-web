"use client";

import { Button } from "@hdruk/ui";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.DeleteExperimentDialog";

interface DeleteExperimentDialogProps {
    experimentId: number;
    experimentName: string;
    callback?: () => void;
}

const DeleteExperimentDialog = ({
    experimentId,
    experimentName,
    callback,
}: DeleteExperimentDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteExperiment = useDelete(apis.experimentsV1Url, {
        itemName: "Experiment",
    });

    const handleDelete = async () => {
        const result = await deleteExperiment(experimentId);
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
                    {t("message", { NAME: experimentName })}
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

export default DeleteExperimentDialog;
