"use client";

import { useState } from "react";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import CheckboxControlled from "@/components/CheckboxControlled";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";

interface DarApplicationActionDialogProps {
    action: () => void;
    title: string;
    intro: string;
}

const TRANSLATION_PATH = "modules.dialogs.DarActionDialog";

const DarApplicationActionDialog = ({
    action,
    title,
    intro,
}: DarApplicationActionDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog();

    const [confirmed, setConfirmed] = useState<boolean>();

    const handleAction = () => {
        action();
        hideDialog();
    };

    return (
        <Dialog title="">
            <MuiDialogContent sx={{ textAlign: "center", mt: 4, pb: 2 }}>
                <Typography fontSize={16}>{title}</Typography>
                <Typography fontSize={16}>{intro}</Typography>

                <CheckboxControlled
                    formControlSx={{
                        display: "inline-block",
                        pt: 1,
                    }}
                    label={t("actionPermanent")}
                    name="confirm-checkbox"
                    onChange={(_e, value) => setConfirmed(value)}
                />
            </MuiDialogContent>
            <MuiDialogActions sx={{ alignSelf: "center", m: 3, mt: 0, gap: 3 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAction()}
                    disabled={!confirmed}
                    sx={{ minWidth: "120px" }}>
                    {t("yes")}
                </Button>

                <Button
                    autoFocus
                    onClick={hideDialog}
                    sx={{ minWidth: "120px" }}>
                    {t("no")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DarApplicationActionDialog;
