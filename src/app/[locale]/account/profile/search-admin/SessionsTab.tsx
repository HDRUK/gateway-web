"use client";

import { useTranslations } from "next-intl";
import { Button } from "@hdruk/ui";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import RevokeAllTokensDialog from "@/modules/RevokeAllTokensDialog";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function SessionsTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    return (
        <Box sx={{ p: 0 }}>
            <Typography variant="h3">{t("sessionsTitle")}</Typography>
            <Typography sx={{ mb: 2 }}>{t("sessionsInfo")}</Typography>
            <Button
                color="error"
                onClick={() => showDialog(RevokeAllTokensDialog)}>
                {t("revokeAllSessions")}
            </Button>
        </Box>
    );
}
