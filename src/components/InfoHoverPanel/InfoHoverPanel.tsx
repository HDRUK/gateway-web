"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "@/components/Button";
import FlashyText from "@/components/FlashyText";
import TitlePanel from "@/components/TitlePanel";

interface InfoHoverPanelProps {
    items: { id: string; image: string; href: string }[];
    defaultImageSrc: string;
}

const InfoHoverPanel = ({ items, defaultImageSrc }: InfoHoverPanelProps) => {
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
            <Box sx={{ p: 0, display: { mobile: "none", desktop: "block" } }}>
                <FlashyText text={t("flashyText")} />
            </Box>
            <Box
                maxWidth={1192}
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
                    <Link
                        key={item.id}
                        passHref
                        onMouseEnter={() => setSelected(item)}
                        href={item.href}>
                        <Button
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
                            variant="outlined">
                            {t(`${item.id}.label`)}
                        </Button>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default InfoHoverPanel;
