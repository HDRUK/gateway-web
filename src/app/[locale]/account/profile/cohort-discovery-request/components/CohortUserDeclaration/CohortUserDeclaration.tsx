"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import CheckboxControlled from "@/components/CheckboxControlled";
import { colors } from "@/config/theme";

const TRANSLATION_PATH = "pages.about.cohortDiscoveryRequest";

interface CohortUserDeclarationProps {
    onSubmit: () => void;
    onCancel: () => void;
}

const CohortUserDeclaration = ({
    onSubmit,
    onCancel,
}: CohortUserDeclarationProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const tCommon = useTranslations("common");
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    return (
        <>
            <Typography>
                {t("userDeclaration")}
                <Typography component="span" color={colors.red600}>
                    *
                </Typography>
            </Typography>
            <Typography color={colors.grey600} sx={{ mb: 1 }}>
                {t("userDeclarationAdditional")}
            </Typography>
            <Typography sx={{ mb: 1 }}>{t("statementIntro")}</Typography>
            <Typography component="div">
                {t.rich("statement1", {
                    list: chunks => <ol>{chunks}</ol>,
                    item: chunks => <li>{chunks}</li>,
                })}
            </Typography>
            <Typography component="div">
                {t.rich("statement2", {
                    list: chunks => <ol>{chunks}</ol>,
                    item: chunks => <li>{chunks}</li>,
                })}
            </Typography>
            <Typography>{t("statementOutro")}</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <CheckboxControlled
                    label={t("checkboxLabel")}
                    name="dataset-population-checkbox"
                    onChange={(_e, value) => setTermsAccepted(value)}
                    checked={termsAccepted}
                />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}>
                        {tCommon("cancel")}
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={termsAccepted !== true}
                        sx={{ flexGrow: 0, height: "auto" }}>
                        {tCommon("submit")}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default CohortUserDeclaration;
