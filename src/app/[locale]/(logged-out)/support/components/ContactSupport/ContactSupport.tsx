"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "@/components/Button";
import { CONTACT_EMAIL_ADDRESS } from "@/consts/application";

const TRANSLATIONS_NAMESPACE_CONTACT_SUPPORT = "components.ContactSupport";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_CONTACT_SUPPORT);

    return (
        <Box sx={{ textAlign: "center" }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
                {t("title")}
            </Typography>
            <Typography sx={{ mb: 3 }}>{t("content")}</Typography>
            <Button
                variant="outlined"
                color="secondary"
                component={Link}
                href={`mailto:${CONTACT_EMAIL_ADDRESS}`}>
                {t("contactButton")}
            </Button>
        </Box>
    );
}
