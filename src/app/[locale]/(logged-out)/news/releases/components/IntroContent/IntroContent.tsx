"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import theme from "@/config/theme";

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.releases";

const IntroContent = () => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    return (
        <Box
            sx={{
                bgcolor: "transparent",
                padding: {
                    mobile: `${theme.spacing(3)} ${theme.spacing(2)}`,
                    tablet: `${theme.spacing(5)} ${theme.spacing(
                        2
                    )} ${theme.spacing(3)}`,
                    desktop: `${theme.spacing(5)} ${theme.spacing(
                        2
                    )} ${theme.spacing(3)}`,
                },
            }}>
            <Typography variant="h2">{t("heading")}</Typography>
            <Typography sx={{ mb: 1 }}>{t("description1")}</Typography>
            <Typography sx={{ mb: 1 }}>{t("description2")}</Typography>
        </Box>
    );
};

export default IntroContent;
