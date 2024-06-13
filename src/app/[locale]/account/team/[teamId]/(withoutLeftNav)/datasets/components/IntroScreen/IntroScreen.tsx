"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import FormLegend from "@/components/FormLegend";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const FORM_LEGEND_EXAMPLE = [
    {
        name: "All fields complete",
        status: 0,
    },
    {
        name: "All required fields complete, some optional fields remain",
        status: 1,
    },
    {
        name: "Not all required fields complete, optional fields may remain",
        status: 2,
    },
    {
        name: "Current form section being viewed",
        status: 3,
    },
    {
        name: "No completed fields",
        status: 4,
    },
];

const IntroScreen = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    return (
        <Box sx={{ mt: 1.25, display: "flex", justifyContent: "center" }}>
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    maxWidth: "desktop",
                    width: "100%",
                }}>
                <Box sx={{ flex: 2 }}>
                    <Box>
                        <Typography variant="h1">
                            {t("welcomeMessage")}
                        </Typography>
                        <Typography sx={{ fontSize: "1.25rem" }}>
                            {t("legendIntro")}
                        </Typography>
                    </Box>
                    <Box sx={{}}>
                        <Typography
                            sx={{
                                fontSize: "1.25rem",
                                fontWeight: "bold",
                                mb: 1,
                            }}>
                            {t("progressLegend")}
                        </Typography>
                        <FormLegend items={FORM_LEGEND_EXAMPLE} />
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }} />
            </Paper>
        </Box>
    );
};

export default IntroScreen;
