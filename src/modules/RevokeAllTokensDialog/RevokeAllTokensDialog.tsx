"use client";

import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { Button } from "@hdruk/ui";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import useLogout from "@/hooks/useLogout";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "modules.dialogs.RevokeAllTokensDialog";

const RevokeAllTokensDialog = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;
    const logout = useLogout();
    const [acknowledged, setAcknowledged] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const revokeAll = usePost(apis.adminRevokeAllTokensV2Url, {
        successNotificationsOn: false,
    });

    const handleConfirm = async () => {
        setIsSubmitting(true);
        const result = await revokeAll({});

        if (!result) {
            setIsSubmitting(false);
            return;
        }

        // The admin's own token predates the cutoff and is now dead too,
        // so sign them out cleanly rather than leave them facing 401s.
        hideDialog();
        await logout();
    };

    return (
        <Dialog title={t("title")} showCloseButton={false}>
            <MuiDialogContent>
                <Typography sx={{ mb: 2 }}>{t("message")}</Typography>
                <Typography color="warning.main" sx={{ mb: 2 }}>
                    {t("selfWarning")}
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={acknowledged}
                            onChange={event =>
                                setAcknowledged(event.target.checked)
                            }
                        />
                    }
                    label={t("acknowledge")}
                />
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={hideDialog}>
                    {t("cancelButton")}
                </Button>

                <Button
                    color="error"
                    disabled={!acknowledged || isSubmitting}
                    onClick={handleConfirm}>
                    {t("confirmButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default RevokeAllTokensDialog;
