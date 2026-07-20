"use client";

import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

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
        <Dialog title="Delete network" showCloseButton={false}>
            <MuiDialogContent>
                <Typography>
                    Are you sure you want to delete &quot;{networkName}
                    &quot;? This cannot be undone.
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    Cancel
                </Button>
                <Button color="error" onClick={handleDelete}>
                    Delete
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DeleteDataCustodianNetworkDialog;
