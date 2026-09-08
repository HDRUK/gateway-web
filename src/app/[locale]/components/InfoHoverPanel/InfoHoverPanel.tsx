"use client";

import { useState } from "react";
import { tokens } from "@hdruk/ui/theme";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { HomepageCtaButton } from "../Homepage/Homepage.styles";
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

// Geometry comes from HomepageCtaButton; only the white treatment and the
// responsive type scale are specific to these tiles.
// NOTE: 19px has no typography variant (body1 is 14px), so it stays literal.
const BUTTON_STYLES = {
    height: "100%",
    background: tokens.background.white,
    borderColor: tokens.background.white,
    fontSize: { xs: 14, sm: 19 },
    "&:hover, &:focus-visible": {
        backgroundColor: "primary.main",
        borderColor: "primary.main",
        color: "primary.contrastText",
    },
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
            <HomepageCtaButton
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
                fullWidth
                sx={BUTTON_STYLES}
                purpose="tertiary"
                disableRipple>
                {t(`${item.id}.label`)}
            </HomepageCtaButton>
        ) : (
            <HomepageCtaButton
                component={Link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={() => setSelected(item)}
                key={item.id}
                href={item.href}
                fullWidth
                sx={BUTTON_STYLES}
                purpose="tertiary"
                disableRipple
                {...(item.externalUrl && {
                    target: "_blank",
                    rel: "noreferrer",
                })}>
                {t(`${item.id}.label`)}
            </HomepageCtaButton>
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
                        xs: tokens.text.primaryWhite,
                        sm: colors.green400,
                        lg: tokens.text.primaryWhite,
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
