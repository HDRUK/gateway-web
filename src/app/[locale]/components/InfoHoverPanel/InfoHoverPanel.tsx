"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "@/components/Button";
import TitlePanel from "@/components/TitlePanel";
import Typography from "@/components/Typography";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";

type HoverPanelItem = {
    id: string;
    image: string;
    href: string;
    loggedIn?: boolean;
    externalUrl?: boolean;
};

interface InfoHoverPanelProps {
    items: HoverPanelItem[];
    itemsResources: HoverPanelItem[];
    defaultImageSrc: string;
}

const BUTTON_STYLES = {
    height: "100%",
    background: "white",
    borderColor: "white",
    borderRadius: { xs: 2, sm: 3 },
    p: { xs: 1, sm: "24px 15px" },
    fontSize: { xs: 14, sm: 19 },
    textAlign: "center",
};

const InfoHoverPanel = ({
    items,
    itemsResources,
    defaultImageSrc,
}: InfoHoverPanelProps) => {
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
            <Button
                component="a"
                onClick={() =>
                    showDialog(ProvidersDialog, {
                        isProvidersDialog: true,
                        redirectPath: item.href,
                    })
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={() => setSelected(item)}
                key={item.id}
                size="large"
                fullWidth
                sx={BUTTON_STYLES}
                variant="outlined"
                disableRipple>
                {t(`${item.id}.label`)}
            </Button>
        ) : (
            <Button
                component={Link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={() => setSelected(item)}
                key={item.id}
                href={item.href}
                size="large"
                fullWidth
                sx={BUTTON_STYLES}
                variant="outlined"
                disableRipple
                {...(item.externalUrl && {
                    target: "_blank",
                    rel: "noreferrer",
                })}>
                {t(`${item.id}.label`)}
            </Button>
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
                id={selected ? selected.id : undefined}
                sx={{ mt: "2rem" }}
            />
            <Box
                sx={{
                    mt: 2,
                    gap: 1,
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    alignItems: "stretch",
                }}>
                {items.map(renderItem)}
            </Box>

            <Typography
                variant="h2"
                sx={{
                    color: {
                        xs: colors.white,
                        sm: colors.green400,
                        lg: colors.white,
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
                        xs: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    alignItems: "stretch",
                }}>
                {itemsResources.map(renderItem)}
            </Box>
        </Box>
    );
};

export default InfoHoverPanel;
