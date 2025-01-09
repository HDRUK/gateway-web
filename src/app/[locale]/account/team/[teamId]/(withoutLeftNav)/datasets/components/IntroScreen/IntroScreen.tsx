"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import CheckboxControlled from "@/components/CheckboxControlled";
import FormLegend from "@/components/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

interface OptionType {
    label: string;
    value: string;
}

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
    "omics",
    "socioeconomic",
    "lifestyle",
    "registry",
    "environmentAndEnergy",
    "informationAndCommunication",
    "politics",
];

interface IntroScreenProps {
    defaultValue: string[];
    defaultTeamId?: number;
    teamOptions?: OptionsType[];
    isLoadingTeams: boolean;
    setDatasetType: (value: string[]) => void;
    handleOnUserInputChange: (e: React.ChangeEvent, value: string) => void;
}

const IntroScreen = ({
    defaultValue,
    defaultTeamId,
    teamOptions,
    isLoadingTeams,
    setDatasetType,
    handleOnUserInputChange,
}: IntroScreenProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const [selectedCheckboxes, setSelectedCheckboxes] =
        useState<string[]>(defaultValue);

    const updateState = (item: string, selected: boolean) => {
        const updatedCheckboxes = selected
            ? [...selectedCheckboxes, item]
            : selectedCheckboxes.filter(v => v !== item);

        setDatasetType(updatedCheckboxes);
        setSelectedCheckboxes(updatedCheckboxes);
    };

    const { control } = useForm({
        defaultValues: { custodianId: defaultTeamId },
    });

    return (
        <>
            <Paper
                sx={{
                    mt: 1.25,
                    padding: 2,
                    flex: 2,
                }}>
                <Box sx={{ p: 0 }}>
                    <Typography variant="h1">{t("welcomeMessage")}</Typography>
                    <Typography sx={{ fontSize: "1.25rem" }}>
                        {t("legendIntro")}
                    </Typography>
                </Box>
                <Box>
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
                <Box>
                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            mb: 1,
                        }}>
                        {t("dataCustodian")}
                    </Typography>

                    <InputWrapper
                        control={control}
                        name="custodianId"
                        options={teamOptions}
                        selectOnFocus
                        onInputChange={handleOnUserInputChange}
                        extraInfo={t("toolTipText")}
                        isLoadingOptions={isLoadingTeams}
                        component={inputComponents.Autocomplete}
                        disableClearable
                        filterOptions={(x: OptionType) => x}
                    />
                </Box>
            </Paper>

            <Paper
                sx={{
                    flex: "1 1 0%",
                    p: 2,
                    m: 1.25,
                    mb: 0,
                    alignItems: "center",
                    wordBreak: "break-word",
                }}>
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
                            gap: 2,
                            p: 0,
                        }}>
                        <CheckboxControlled
                            label={t(`${CHECKBOX_PREFIX}.${checkbox}`)}
                            name={t(`${CHECKBOX_PREFIX}.${checkbox}`)}
                            sx={{ pt: 0, pb: 0 }}
                            onChange={(_, value) =>
                                updateState(
                                    t(`${CHECKBOX_PREFIX}.${checkbox}`),
                                    value
                                )
                            }
                            checked={
                                !!defaultValue.includes(
                                    t(`${CHECKBOX_PREFIX}.${checkbox}`)
                                )
                            }
                            formControlSx={{ mb: 2 }}
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
            </Paper>
        </>
    );
};

export default IntroScreen;
