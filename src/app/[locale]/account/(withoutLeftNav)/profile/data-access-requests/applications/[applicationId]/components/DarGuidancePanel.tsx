"use client";

import { tokens } from "@hdruk/ui/theme";
import { Divider, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Typography from "@/components/Typography";
import theme from "@/config/theme";
import { HelpOutlineIcon } from "@/consts/icons";

const TRANSLATION_PATH = "pages.account.team.dar.application.create";

interface DarGuidancePanelProps {
    guidanceText?: string;
}

const DarGuidancePanel = ({ guidanceText }: DarGuidancePanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const isStacked = useMediaQuery(theme.breakpoints.down("md"), {
        noSsr: true,
    });

    const heading = (
        <Typography
            variant="h3"
            component={isStacked ? "span" : "h3"}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isStacked ? "flex-start" : "center",
                m: 0,
            }}>
            <HelpOutlineIcon
                sx={{
                    mr: 1,
                    color: tokens.text.disabled,
                    fontSize: 16,
                }}
            />
            {t("guidance")}
        </Typography>
    );

    const contents = (
        <Box
            sx={{
                pt: 0,
                pb: 0,
                px: isStacked ? 0 : 2,
                overflowWrap: "anywhere",
                ...(isStacked && { maxHeight: "40vh", overflowY: "auto" }),
            }}>
            {guidanceText ? (
                <MarkDownSanitizedWithHtml content={guidanceText} />
            ) : (
                <Typography
                    sx={{
                        color: theme.palette.grey[500],
                        textAlign: isStacked ? "left" : "center",
                    }}>
                    {t("defaultGuidance")}
                </Typography>
            )}
        </Box>
    );

    if (isStacked) {
        return (
            <Box
                sx={{
                    px: 3,
                    py: 0,
                    order: -1,
                    width: "100%",
                    position: "sticky",
                    top: 0,
                    zIndex: theme.zIndex.appBar,
                    bgcolor: "background.paper",
                }}>
                <Accordion
                    heading={heading}
                    contents={contents}
                    headingComponent="h3"
                    noIndent
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                p: 0,
                position: "sticky",
                top: 0,
                alignSelf: "flex-start",
                maxHeight: `calc(100vh - ${theme.spacing(2)})`,
                display: "flex",
                flexDirection: "column",
            }}>
            <Box sx={{ flexShrink: 0 }}>{heading}</Box>
            <Divider variant="fullWidth" sx={{ mb: 4, flexShrink: 0 }} />
            <Box sx={{ p: 0, minHeight: 0, overflowY: "auto" }}>{contents}</Box>
        </Box>
    );
};

export default DarGuidancePanel;
