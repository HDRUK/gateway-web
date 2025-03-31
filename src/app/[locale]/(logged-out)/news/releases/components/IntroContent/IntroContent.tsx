"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Link from "@/components/Link";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";

const richTextComponents = {
    researchersLink: (chunks: React.ReactNode) => (
        <Link href={RouteName.RESEARCHERS}>{chunks}</Link>
    ),
    supportLink: (chunks: React.ReactNode) => (
        <Link href={`/${RouteName.SUPPORT}`}>{chunks}</Link>
    ),
    githubLink: (chunks: React.ReactNode) => (
        <Link
            href="https://github.com/HDRUK/gateway-api/blob/dev/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer">
            {chunks}
        </Link>
    ),
};

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

            <Typography sx={{ mb: 1 }}>
                {t.rich("description1", richTextComponents)}
            </Typography>
            <Typography>
                {t.rich("description2", richTextComponents)}
            </Typography>
        </Box>
    );
};

export default IntroContent;
