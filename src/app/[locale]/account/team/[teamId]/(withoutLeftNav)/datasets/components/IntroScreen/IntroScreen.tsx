"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import FormLegend from "@/components/FormLegend";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
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

const CHECKBOX_PREFIX = "checkboxes";
const TOOLTIP_SUFFIX = "Tooltip";
const METADATA_CHECKBOXES = [
    "healthAndDisease",
    "treatmentsInterventions",
    "measurementsTests",
    "imagingTypes",
    "imagingAreaOfTheBody",
    "omics",
    "socioeconomic",
    "lifestyle",
    "registry",
    "environmentAndEnergy",
    "informationAndCommunication",
    "politics",
];

const defaultValues = {
    healthAndDisease: false,
    treatmentsInterventions: false,
};

type FormData = {
    healthAndDisease: boolean;
    treatmentsInterventions: boolean;
};

const IntroScreen = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { control } = useForm<FormData>({
        defaultValues,
    });

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
                <Box sx={{ flex: 1, pt: 4 }}>
                    <Typography variant="h2">{t("checkboxIntro")}</Typography>
                    <Typography sx={{ color: colors.grey600, pb: 2 }}>
                        {t("selectAll")}
                    </Typography>

                    {METADATA_CHECKBOXES.map(checkbox => (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                p: 0,
                            }}>
                            <Checkbox
                                label={t(`${CHECKBOX_PREFIX}.${checkbox}`)}
                                control={control}
                                name={checkbox}
                                sx={{ pt: 0, pb: 0 }}
                            />
                            <TooltipIcon
                                label=""
                                content={t(
                                    `${CHECKBOX_PREFIX}.${checkbox}${TOOLTIP_SUFFIX}`
                                )}
                                buttonSx={{ p: 0 }}
                            />
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default IntroScreen;
