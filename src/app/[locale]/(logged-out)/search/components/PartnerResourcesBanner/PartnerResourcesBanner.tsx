"use client";

import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { PartnerPortal } from "@/interfaces/Search";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.search.components.PartnerResourcesBanner";

interface PartnerResourcesBannerProps {
    count: number;
    isLoading?: boolean;
    portals: Pick<PartnerPortal, "name" | "logo">[];
    onViewPartnerResources: () => void;
}

const PartnerResourcesBanner = ({
    count,
    isLoading,
    portals,
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
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {portals.map(portal => (
                        <Box
                            key={portal.name}
                            component="img"
                            src={portal.logo}
                            alt={portal.name}
                            sx={{ height: 35 }}
                        />
                    ))}
                </Box>
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
