"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import { colors } from "@/config/theme";

const TRANSLATION_PATH = "pages.search.components.PartnerResourcesBanner";
const ARDC_FALLBACK_LOGO =
    "https://demo.researchdata.ardc.edu.au/hd-portal/images/ardc-logo.svg";

interface PartnerResourcesBannerProps {
    count: number;
    providerLogo?: string | null;
    onViewPartnerResources: () => void;
}

const PartnerResourcesBanner = ({
    count,
    providerLogo,
    onViewPartnerResources,
}: PartnerResourcesBannerProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: { mobile: "column", laptop: "row" },
                alignItems: { mobile: "flex-start", laptop: "center" },
                justifyContent: "space-between",
                gap: 6,
                p: 3,
                my: 2,
                mx: 2,
                backgroundColor: colors.grey100,
                border: `1px solid ${colors.grey600}`,
            }}
            elevation={0}>
            <Typography
                fontWeight={700}
                fontSize={20}
                sx={{ color: colors.green800 }}>
                {count} {t("partnerResources")}
            </Typography>
            <Box sx={{ flex: 1 }}>
                <Typography
                    mb={1.5}
                    sx={{ color: colors.grey800, fontSize: 15 }}>
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
                variant="outlined"
                color="secondary"
                onClick={() => {
                    onViewPartnerResources();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{
                    alignSelf: { mobile: "stretch", laptop: "center" },
                }}>
                {t("viewPartnerResources")}
            </Button>
        </Paper>
    );
};

export default PartnerResourcesBanner;
