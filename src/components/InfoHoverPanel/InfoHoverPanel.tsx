"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "@/components/Button";
import FlashyText from "@/components/FlashyText";
import TitlePanel from "@/components/TitlePanel";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";

type HoverPanelItem = {
    id: string;
    image: string;
    href: string;
    loggedIn?: boolean;
};

interface InfoHoverPanelProps {
    items: HoverPanelItem[];
    defaultImageSrc: string;
}

const BUTTON_STYLES = {
    height: "100%",
    background: "white",
    borderColor: "white",
    borderRadius: { mobile: 2, tablet: 3 },
    p: { mobile: 1, tablet: "24px 15px" },
    fontSize: { mobile: 14, tablet: 19 },
};

const InfoHoverPanel = ({ items, defaultImageSrc }: InfoHoverPanelProps) => {
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const t = useTranslations("pages.home");

    const [selected, setSelected] = useState<{
        id: string;
        image: string;
        href: string;
    } | null>();

    const renderItem = (item: HoverPanelItem) => {
        const handleMouseEnter = () => setSelected(item);
        const handleMouseLeave = () => setSelected(null);

        return item.loggedIn && !isLoggedIn ? (
            <Box
                key={item.id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <Button
                    onClick={() =>
                        showDialog(ProvidersDialog, {
                            isProvidersDialog: true,
                            redirectPath: item.href,
                        })
                    }
                    size="large"
                    fullWidth
                    sx={BUTTON_STYLES}
                    variant="outlined">
                    {t(`${item.id}.label`)}
                </Button>
            </Box>
        ) : (
            <Link
                key={item.id}
                passHref
                href={item.href}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <Button
                    size="large"
                    fullWidth
                    sx={BUTTON_STYLES}
                    variant="outlined">
                    {t(`${item.id}.label`)}
                </Button>
            </Link>
        );
    };

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
                {items.map(renderItem)}
            </Box>
        </Box>
    );
};

export default InfoHoverPanel;
