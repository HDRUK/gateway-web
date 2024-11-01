"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Box from "@/components/Box";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.releases";

const IntroContent = () => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    return (
        <Box
            sx={{
                bgcolor: "transparent",
                padding: {
                    mobile: `${theme.spacing(3)} ${theme.spacing(2)}`,
                    [theme.breakpoints.up("mobile")]: `${theme.spacing(
                        5
                    )} ${theme.spacing(2)} ${theme.spacing(3)}`,
                },
            }}>
            <Typography variant="h2">{t("heading")}</Typography>
            <Typography sx={{ mb: 1 }}>{t("description1")}</Typography>

            <Typography>
                {t.rich(`description2`, {
                    // eslint-disable-next-line react/no-unstable-nested-components
                    researchersLink: chunks => (
                        <Link href={`${RouteName.RESEARCHERS}`}>{chunks}</Link>
                    ),
                    // eslint-disable-next-line react/no-unstable-nested-components
                    supportLink: chunks => (
                        <Link href={`/${RouteName.SUPPORT}`}>{chunks}</Link>
                    ),
                })}
            </Typography>
        </Box>
    );
};

export default IntroContent;
