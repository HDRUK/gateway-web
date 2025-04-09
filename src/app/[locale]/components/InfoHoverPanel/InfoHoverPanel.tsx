"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import TitlePanel from "@/components/TitlePanel";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface InfoHoverPanelProps {
    items: { id: string; image: string; href: string }[];
    itemsResources: { id: string; image: string; href: string }[];
    defaultImageSrc: string;
}

const InfoHoverPanel = ({
    items,
    itemsResources,
    defaultImageSrc,
}: InfoHoverPanelProps) => {
    const t = useTranslations("pages.home");

    const [selected, setSelected] = useState<{
        id: string;
        image: string;
        href: string;
    } | null>();

    return (
        <Box>
            <TitlePanel
                image={selected ? selected?.image : defaultImageSrc}
                text={selected ? t(`${selected?.id}.text`) : t("welcomeText")}
                title={
                    selected ? t(`${selected?.id}.title`) : t("welcomeTitle")
                }
                sx={{ mt: "2rem" }}
            />
            <Box
                sx={{
                    mt: 2,
                    gap: 1,
                    display: "grid",
                    gridTemplateColumns: {
                        mobile: "repeat(2, 1fr)",
                        desktop: "repeat(4, 1fr)",
                    },
                    alignItems: "stretch",
                }}>
                {items.map(item => (
                    <Button
                        onMouseEnter={() => setSelected(item)}
                        onMouseLeave={() => setSelected(null)}
                        onFocus={() => setSelected(item)}
                        key={item.id}
                        href={item.href}
                        size="large"
                        fullWidth
                        sx={{
                            height: "100%",
                            background: "white",
                            borderColor: "white",
                            borderRadius: { mobile: 2, tablet: 3 },
                            p: { mobile: 1, tablet: "24px 15px" },
                            fontSize: { mobile: 14, tablet: 19 },
                        }}
                        variant="outlined"
                        disableRipple>
                        {t(`${item.id}.label`)}
                    </Button>
                ))}
            </Box>

            <Typography
                variant="h2"
                sx={{
                    color: {
                        mobile: colors.white,
                        tablet: colors.green400,
                        desktop: colors.white,
                    },
                    fontSize: 24,
                    mt: 3,
                    mb: 1,
                }}>
                Connected Resources
            </Typography>
            <Box
                sx={{
                    mt: 2,
                    gap: 1,
                    display: "grid",
                    gridTemplateColumns: {
                        mobile: "repeat(2, 1fr)",
                        desktop: "repeat(4, 1fr)",
                    },
                    alignItems: "stretch",
                }}>
                {itemsResources.map(item => (
                    <Button
                        component="a"
                        onMouseEnter={() => setSelected(item)}
                        onMouseLeave={() => setSelected(null)}
                        onFocus={() => setSelected(item)}
                        key={item.id}
                        href={item.href}
                        size="large"
                        fullWidth
                        sx={{
                            height: "100%",
                            background: "white",
                            borderColor: "white",
                            borderRadius: { mobile: 2, tablet: 3 },
                            p: { mobile: 1, tablet: "24px 15px" },
                            fontSize: { mobile: 14, tablet: 19 },
                        }}
                        variant="outlined"
                        disableRipple
                        target="_blank"
                        rel="noopener">
                        {t(`${item.id}.label`)}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default InfoHoverPanel;
