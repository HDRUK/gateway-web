"use client";

import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "modules.dialogs.AddDatasetDialog";

interface AddDatasetDialogProps {
    teamId: number;
}

const AddDatasetDialog = ({ teamId }: AddDatasetDialogProps) => {
    const router = useRouter();
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const DATASET_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`;

    const handleManual = () => {
        hideDialog();
        router.push(`${DATASET_ROUTE}/${RouteName.CREATE}`);
    };

    const handleUpload = () => {
        hideDialog();
        router.push(`${DATASET_ROUTE}/${RouteName.UPLOAD}`);
    };

    return (
        <Dialog title="">
            <MuiDialogContent
                sx={{ display: "flex", mt: 3, justifyContent: "center" }}>
                <Typography variant="h2" sx={{ m: 0 }}>
                    {t("title")}
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions sx={{ p: 3, pt: 1, justifyContent: "center" }}>
                <Button onClick={handleManual}>{t("manualButton")}</Button>
                <Button onClick={handleUpload}>{t("uploadButton")}</Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default AddDatasetDialog;
