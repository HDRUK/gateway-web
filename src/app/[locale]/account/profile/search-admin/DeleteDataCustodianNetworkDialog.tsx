"use client";

import { useTranslations } from "next-intl";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { Button } from "@hdruk/ui";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.DeleteDataCustodianNetworkDialog";

interface DeleteDataCustodianNetworkDialogProps {
    networkId: number;
    networkName: string;
    callback?: () => void;
}

const DeleteDataCustodianNetworkDialog = ({
    networkId,
    networkName,
    callback,
}: DeleteDataCustodianNetworkDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const deleteNetwork = useDelete(apis.dataCustodianNetworkV2Url, {
        itemName: "Data Custodian Network",
    });

    const handleDelete = async () => {
        const result = await deleteNetwork(networkId);
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
                    {t("message", { NETWORK_NAME: networkName })}
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

export default DeleteDataCustodianNetworkDialog;
