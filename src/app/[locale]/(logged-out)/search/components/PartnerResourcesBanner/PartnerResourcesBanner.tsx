"use client";

import { tokens } from "@hdruk/ui/theme";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Button } from "@hdruk/ui";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.search.components.PartnerResourcesBanner";
const ARDC_FALLBACK_LOGO =
    "https://demo.researchdata.ardc.edu.au/hd-portal/images/ardc-logo.svg";

interface PartnerResourcesBannerProps {
    count: number;
    isLoading?: boolean;
    providerLogo?: string | null;
    onViewPartnerResources: () => void;
}

const PartnerResourcesBanner = ({
    count,
    isLoading,
    providerLogo,
    onViewPartnerResources,
}: PartnerResourcesBannerProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    if (isLoading) return null;

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 6,
                p: 3,
                my: 2,
                mx: 2,
                backgroundColor: tokens.background.primary,
                border: `1px solid ${tokens.status.faded}`,
            }}
            elevation={0}>
            <Typography
                fontWeight={700}
                fontSize={20}
                sx={{ color: tokens.brand.secondaryHovered }}>
                {count} {t("partnerResources")}
            </Typography>
            <Box sx={{ flex: 1 }}>
                <Typography
                    mb={1.5}
                    sx={{ color: tokens.text.secondaryBlack, fontSize: 15 }}>
                    {t("partnerResourcesBanner")}
                </Typography>
                <Box
                    component="img"
                    src={providerLogo || ARDC_FALLBACK_LOGO}
                    alt="ARDC"
                    sx={{ height: 35 }}
                />
            </Box>
            <Button
                purpose="secondary"
                onClick={() => {
                    onViewPartnerResources();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{
                    alignSelf: { xs: "stretch", md: "center" },
                }}>
                {t("viewPartnerResources")}
            </Button>
        </Paper>
    );
};

export default PartnerResourcesBanner;
