"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Unit, Widget } from "@/interfaces/Widget";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import { DATA_CUSTODIAN_LIMIT } from "../../const";
import { getChipLabel, isOptionEqualToValue } from "../../utils";

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

interface WidgetConfigFormProps {
    form: UseFormReturn<Widget>;
    teamId: string;
    teamNameOptions: { value: string; label: string }[];
    formatEntityOptions: (
        entityType: string,
        valueKey: string,
        labelKey: string
    ) => { value: string; label: string; team?: string }[] | undefined;
    selectAllOptions: (formValue: string, entityType: string) => void;
    onSubmit: (
        values: Widget,
        dirtyFields: Partial<Record<keyof Widget, boolean>>
    ) => Promise<void>;
}

const WidgetConfigForm = ({
    form,
    teamId,
    teamNameOptions,
    formatEntityOptions,
    selectAllOptions,
    onSubmit,
}: WidgetConfigFormProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { control, handleSubmit, watch, setValue } = form;

    const unitOptions: { value: Unit; label: string }[] = Object.values(
        Unit
    ).map(u => ({ value: u, label: u }));

    const configSections = [
        {
            section: "Content",
            name: t("content"),
            fields: [
                {
                    name: "data_custodian_entities_ids",
                    label: "Select Custodians",
                    info: `You might just want to show entities from yourselves for example. A maximum of ${DATA_CUSTODIAN_LIMIT} can be selected.`,
                    component: inputComponents.Autocomplete,
                    required: true,
                    multiple: true,
                    options: teamNameOptions,
                    getChipLabel,
                    isOptionEqualToValue,
                    marginLeft: true,
                    height: 250,
                    chipColor: "success",
                    getOptionDisabled: () =>
                        watch("data_custodian_entities_ids").length >=
                        DATA_CUSTODIAN_LIMIT,
                },
                {
                    name: "has_datasets",
                    label: "Datasets & BioSamples",
                    component: inputComponents.Checkbox,
                },
                {
                    name: "included_datasets",
                    label: "Select Datasets",
                    component: inputComponents.Autocomplete,
                    multiple: true,
                    groupBy: option => option.team,
                    options: formatEntityOptions("datasets", "id", "title"),
                    getChipLabel,
                    isOptionEqualToValue,
                    marginLeft: true,
                    showWhen: "has_datasets",
                    selectAllButton: (
                        <Button
                            onClick={() =>
                                selectAllOptions(
                                    "included_datasets",
                                    "datasets"
                                )
                            }
                            variant="link">
                            Select all
                        </Button>
                    ),
                    chipColor: "success",
                },
                {
                    name: "has_datauses",
                    label: "Data Uses / Research Projects",
                    component: inputComponents.Checkbox,
                },
                {
                    name: "included_data_uses",
                    label: "Select Data Uses / Research Projects",
                    component: inputComponents.Autocomplete,
                    multiple: true,
                    options: formatEntityOptions("durs", "id", "name"),
                    getChipLabel,
                    isOptionEqualToValue,
                    marginLeft: true,
                    showWhen: "has_datauses",
                    groupBy: option => option.team,
                    selectAllButton: (
                        <Button
                            onClick={() =>
                                selectAllOptions("included_data_uses", "durs")
                            }
                            variant="link">
                            Select all
                        </Button>
                    ),
                    chipColor: "success",
                },
                {
                    name: "has_scripts",
                    label: t("scripts"),
                    component: inputComponents.Checkbox,
                },
                {
                    name: "included_scripts",
                    label: t("scripts"),
                    component: inputComponents.Autocomplete,
                    multiple: true,
                    options: formatEntityOptions("tools", "id", "name"),
                    getChipLabel,
                    isOptionEqualToValue,
                    marginLeft: true,
                    showWhen: "has_scripts",
                    groupBy: option => option.team,
                    selectAllButton: (
                        <Button
                            onClick={() =>
                                selectAllOptions("included_scripts", "tools")
                            }
                            variant="link">
                            Select all
                        </Button>
                    ),
                    chipColor: "success",
                },
                {
                    name: "has_collections",
                    label: t("collections"),
                    component: inputComponents.Checkbox,
                },
                {
                    name: "included_collections",
                    label: t("selectCollections"),
                    component: inputComponents.Autocomplete,
                    multiple: true,
                    options: formatEntityOptions("collections", "id", "name"),
                    getChipLabel,
                    isOptionEqualToValue,
                    marginLeft: true,
                    showWhen: "has_collections",
                    groupBy: option => option.team,
                    selectAllButton: (
                        <Button
                            onClick={() =>
                                selectAllOptions(
                                    "included_collections",
                                    "collections"
                                )
                            }
                            variant="link">
                            Select all
                        </Button>
                    ),
                    chipColor: "success",
                },
            ],
        },
        {
            section: "Functionality",
            name: "Functionality",
            fields: [
                {
                    name: "include_search_bar",
                    label: t("searchBar"),
                    info: t("searchBarInfo"),
                    component: inputComponents.Checkbox,
                },
                {
                    name: "include_cohort_link",
                    label: t("cohortLink"),
                    info: t("cohortLinkInfo"),
                    component: inputComponents.Checkbox,
                },
                {
                    name: "permitted_domains",
                    label: t("permittedDomains"),
                    component: inputComponents.Autocomplete,
                    multiple: true,
                    handleHomeEndKeys: true,
                    selectOnFocus: true,
                    clearOnBlur: true,
                    canCreate: true,
                },
            ],
        },
        {
            section: "Size",
            name: "Size",
            intro: (
                <>
                    <Typography fontSize={16}>{t("size")}</Typography>
                    <Typography>{t("sizeInfo")}</Typography>
                    <Box sx={{ display: "flex", p: 0, gap: 3, mb: 2 }}>
                        <Button
                            onClick={() => {
                                setValue("size_width", 600, {
                                    shouldDirty: true,
                                });
                                setValue("size_height", 740, {
                                    shouldDirty: true,
                                });
                                setValue("unit", Unit.PX, {
                                    shouldDirty: true,
                                });
                            }}
                            variant="link"
                            sx={{ color: colors.green700 }}>
                            {t("sizeLarge")}
                        </Button>
                        <Button
                            onClick={() => {
                                setValue("size_width", 400, {
                                    shouldDirty: true,
                                });
                                setValue("size_height", 592, {
                                    shouldDirty: true,
                                });
                                setValue("unit", Unit.PX, {
                                    shouldDirty: true,
                                });
                            }}
                            variant="link"
                            sx={{ color: colors.green700 }}>
                            {t("sizeMedium")}
                        </Button>
                        <Button
                            onClick={() => {
                                setValue("size_width", 300, {
                                    shouldDirty: true,
                                });
                                setValue("size_height", 444, {
                                    shouldDirty: true,
                                });
                                setValue("unit", Unit.PX, {
                                    shouldDirty: true,
                                });
                            }}
                            variant="link"
                            sx={{ color: colors.green700 }}>
                            {t("sizeSmall")}
                        </Button>
                    </Box>
                </>
            ),
            fields: [
                {
                    name: "size_width",
                    label: "Width",
                    component: inputComponents.TextField,
                    type: "number",
                    inline: true,
                },
                {
                    name: "size_height",
                    label: "Height",
                    component: inputComponents.TextField,
                    type: "number",
                    inline: true,
                },
                {
                    name: "unit",
                    label: "Unit",
                    component: inputComponents.Select,
                    options: unitOptions,
                    inline: true,
                },
            ],
        },
        {
            section: "Name",
            fields: [
                {
                    name: "widget_name",
                    label: t("name"),
                    info: t("nameInfo"),
                    component: inputComponents.TextField,
                },
            ],
        },
    ];

    return (
        <Paper sx={{ marginBottom: "10px", padding: 2 }}>
            <FormProvider {...form}>
                <Form
                    sx={{ mt: 3 }}
                    onSubmit={handleSubmit(values =>
                        onSubmit(
                            values,
                            form.formState.dirtyFields as Partial<
                                Record<keyof Widget, boolean>
                            >
                        )
                    )}>
                    {configSections.map(section => (
                        <>
                            <Typography
                                key={section.section}
                                fontSize={16}
                                fontWeight={600}
                                sx={{ mt: 6, mb: 2 }}>
                                {section.name}
                            </Typography>

                            {section?.intro && section.intro}

                            {section.fields.map(field =>
                                !field.showWhen || watch(field.showWhen) ? (
                                    <Box
                                        key={field.name}
                                        sx={{
                                            ml: field.marginLeft ? 5 : 0,
                                            mb: field.marginLeft ? 4 : 0,
                                            p: 0,
                                            ...(field.inline && {
                                                display: "inline-block",
                                                mr: 2,
                                                maxWidth: 100,
                                            }),
                                        }}>
                                        <InputWrapper
                                            control={control}
                                            {...field}
                                        />
                                        {field.selectAllButton &&
                                            field.selectAllButton}
                                    </Box>
                                ) : null
                            )}
                        </>
                    ))}
                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                            gap: 2,
                            mt: 5,
                        }}>
                        <Button type="submit">{t("save")}</Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            href={`/en/account/team/${teamId}/integrations/widgets`}>
                            {t("cancel")}
                        </Button>
                    </Box>
                </Form>
            </FormProvider>
        </Paper>
    );
};

export default WidgetConfigForm;
