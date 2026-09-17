"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Link from "@/components/Link";
import theme from "@/config/theme";

const richTextComponents = {
    bold: (chunks: React.ReactNode) => <b>{chunks}</b>,
    supportLink: (chunks: React.ReactNode) => (
        <Link
            href="https://hdruk.atlassian.net/servicedesk/customer/portal/7/group/82/create/78?customfield_10752=11728"
            target="_blank"
            rel="noopener noreferrer">
            {chunks}
        </Link>
    ),
    gatewayLink: (chunks: React.ReactNode) => (
        <Link
            href="https://github.com/HDRUK/gateway-api/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer">
            {chunks}
        </Link>
    ),
    cohortWebLink: (chunks: React.ReactNode) => (
        <Link
            href="https://github.com/HDRUK/cohort-discovery-service-web/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer">
            {chunks}
        </Link>
    ),
    cohortApiLink: (chunks: React.ReactNode) => (
        <Link
            href="https://github.com/HDRUK/cohort-discovery-service-api/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer">
            {chunks}
        </Link>
    ),
    cohortNlpLink: (chunks: React.ReactNode) => (
        <Link
            href="https://github.com/HDRUK/cohort-discovery-service-nlp/blob/main/CHANGELOG.md"
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
                    xs: `${theme.spacing(3)} ${theme.spacing(2)}`,
                    [theme.breakpoints.up("xs")]: `${theme.spacing(
                        5
                    )} ${theme.spacing(2)} ${theme.spacing(3)}`,
                },
            }}>
            <Typography variant="h2">{t("heading")}</Typography>

            <Typography sx={{ mb: 1 }}>
                {t.rich("description1", richTextComponents)}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                {t.rich("description2", richTextComponents)}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                {t.rich("description3", richTextComponents)}
            </Typography>
            <Typography variant="body2">
                {t.rich("note", richTextComponents)}
            </Typography>
        </Box>
    );
};

export default IntroContent;
