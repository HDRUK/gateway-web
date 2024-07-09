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

const TRANSLATION_PATH = "modules.dialogs.AddDataUseDialog";

interface AddDataUseDialogProps {
    teamId: number;
}

const AddDataUseDialog = ({ teamId }: AddDataUseDialogProps) => {
    const router = useRouter();
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const DATAUSE_CREATE_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}/${RouteName.CREATE}`;

    const handleManual = () => {
        hideDialog();
        router.push(DATAUSE_CREATE_ROUTE);
    };

    const handleUpload = () => {
        hideDialog();
        router.push(`${DATAUSE_CREATE_ROUTE}?tab=UPLOAD`);
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

export default AddDataUseDialog;
