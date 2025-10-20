"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { OptionType } from "dayjs";
import { useTranslations } from "next-intl";
import * as yup from "yup";
import { TeamNames } from "@/interfaces/Team";
import { Unit, Widget } from "@/interfaces/Widget";
import { getChipLabel } from "@/components/Autocomplete/utils";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";

interface WidgetListProps {
    widget?: Widget;
    teamId: string;
    teamNames: TeamNames[];
}

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

enum TabValues {
    CONFIGURATION = "configuration",
    PREVIEW = "preview",
}

const UNIT_OPTIONS: { value: Unit; label: string }[] = Object.values(Unit).map(
    u => ({ value: u, label: u })
);

const WidgetCreator = ({ widget, teamId, teamNames }: WidgetListProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const teamNameOptions = useMemo(
        () =>
            teamNames.map(team => ({
                value: team.id,
                label: team.name,
            })),
        [teamNames]
    );

    const defaultValues = useMemo(() => {
        const match = teamNameOptions.find(
            team => team.value.toString() === teamId
        );
        return {
            data_custodian_entities_ids: match ? [match.value] : [],
        };
    }, [teamNameOptions, teamId]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { dirtyFields },
    } = useForm({
        defaultValues: {
            ...defaultValues,
            included_datasets: [],
            included_data_uses: [],
            included_scripts: [],
            included_collections: [],
            permitted_domains: [],
            keep_proportions: false,
            has_datasets: false,
            has_data_custodians: false,
            has_datause: false,
            has_scripts: false,
            has_collections: false,
            include_search_bar: false,
            include_cohort_link: false,
            size_width: 0,
            size_height: 0,
            unit: Unit.PX,
            widget_name: "",
            ...widget,
        },
        resolver: yupResolver(
            yup
                .object({
                    data_custodian_entities_ids: yup
                        .array()
                        .of(yup.string())
                        .label(t("dataCustodians"))
                        .min(
                            1,
                            ({ label, path }) =>
                                `${label || path} must have at least 1 item`
                        ),
                    permitted_domains: yup
                        .array()
                        .of(yup.string().url(t("validUrl")))
                        .label(t("permittedDomains"))
                        .min(
                            1,
                            ({ label, path }) =>
                                `${label || path} must have at least 1 item`
                        ),
                    widget_name: yup.string().required().label(t("widgetName")),
                })

                .required()
        ),
    });

    const { data: entityData } = useGet(
        `${apis.teamsV1Url}/${teamId}/widgets/data?team_ids=${watch(
            "data_custodian_entities_ids"
        )}`,
        { shouldFetch: !!watch("data_custodian_entities_ids")?.length }
    );

    const createWidget = usePost<Widget>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );

    const updateWidget = usePut<Partial<Widget>>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );

    const formatEntityOptions = useCallback(
        (entityType: string, valueKey: string, labelKey: string) =>
            entityData?.[entityType]?.map(entity => ({
                value: entity?.[valueKey],
                label: entity?.[labelKey],
                team: entity?.team_name,
            })),
        [entityData]
    );

    const configSections = useMemo(
        () => [
            {
                section: "Content",
                name: t("content"),
                fields: [
                    {
                        name: "has_data_custodians",
                        label: t("contentLabel"),
                        info: t("contentInfo"),
                        component: inputComponents.Checkbox,
                        required: true,
                    },
                    {
                        name: "data_custodian_entities_ids",
                        label: "Select Custodians",
                        info: "You might just want to show entities from yourselves for example",
                        component: inputComponents.Autocomplete,
                        required: true,
                        multiple: true,
                        options: teamNameOptions,
                        getChipLabel,
                        isOptionEqualToValue: (
                            option: { value: string | number; label: string },
                            value: string | number
                        ) => option.value === value,
                        marginLeft: true,
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
                        getChipLabel: (options, value) =>
                            options.find(option => option.value === value)
                                ?.label,
                        isOptionEqualToValue: (
                            option: { value: string | number; label: string },
                            value: string | number
                        ) => option.value === value,
                        marginLeft: true,
                        showWhen: "has_datasets",
                    },

                    {
                        name: "has_datause",
                        label: "Data Uses / Research Projects",
                        component: inputComponents.Checkbox,
                    },
                    {
                        name: "included_data_uses",
                        label: "Select Data Uses / Research Projects",
                        component: inputComponents.Autocomplete,
                        multiple: true,
                        options: formatEntityOptions("durs", "id", "name"),
                        getChipLabel: (options, value) =>
                            options.find(option => option.value === value)
                                ?.label,
                        isOptionEqualToValue: (
                            option: { value: string | number; label: string },
                            value: string | number
                        ) => option.value === value,
                        marginLeft: true,
                        showWhen: "has_datause",
                        groupBy: option => option.team,
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
                        getChipLabel: (options, value) =>
                            options.find(option => option.value === value)
                                ?.label,
                        isOptionEqualToValue: (
                            option: { value: string | number; label: string },
                            value: string | number
                        ) => option.value === value,
                        marginLeft: true,
                        showWhen: "has_scripts",
                        groupBy: option => option.team,
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
                        options: formatEntityOptions(
                            "collections",
                            "id",
                            "name"
                        ),
                        getChipLabel: (options, value) =>
                            options.find(option => option.value === value)
                                ?.label,
                        isOptionEqualToValue: (
                            option: { value: string | number; label: string },
                            value: string | number
                        ) => option.value === value,
                        marginLeft: true,
                        showWhen: "has_collections",
                        groupBy: option => option.team,
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
                                    setValue("size_width", 600);
                                    setValue("size_height", 740);
                                    setValue("unit", Unit.PX);
                                }}
                                variant="link"
                                sx={{ color: colors.green700 }}>
                                {t("sizeLarge")}
                            </Button>
                            <Button
                                onClick={() => {
                                    setValue("size_width", 400);
                                    setValue("size_height", 592);
                                    setValue("unit", Unit.PX);
                                }}
                                variant="link"
                                sx={{ color: colors.green700 }}>
                                {t("sizeMedium")}
                            </Button>
                            <Button
                                onClick={() => {
                                    setValue("size_width", 300);
                                    setValue("size_height", 444);
                                    setValue("unit", Unit.PX);
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
                    },
                    {
                        name: "size_height",
                        label: "Height",
                        component: inputComponents.TextField,
                        type: "number",
                    },
                    {
                        name: "unit",
                        label: "Unit",
                        component: inputComponents.Select,
                        options: UNIT_OPTIONS,
                    },
                    {
                        name: "keep_proportions",
                        label: "Keep proportions",
                        component: inputComponents.Checkbox,
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
        ],
        [formatEntityOptions, setValue, t, teamNameOptions]
    );

    const onSubmit = async (values: Widget) => {
        if (!widget) {
            createWidget(values);
        } else {
            updateWidget(widget.id, dirtyFields as Partial<Widget>);
        }
    };

    return (
        <Tabs
            centered
            tabBoxSx={{ background: "white", mb: 0 }}
            rootBoxSx={{ p: 0, mt: 3 }}
            tabs={[
                {
                    value: TabValues.CONFIGURATION,
                    label: t("configuration"),
                    content: (
                        <Paper
                            sx={{
                                marginBottom: "10px",
                                padding: 2,
                            }}>
                            <Form
                                sx={{ mt: 3 }}
                                onSubmit={handleSubmit(onSubmit)}>
                                {configSections.map(section => {
                                    return (
                                        <>
                                            <Typography
                                                fontSize={16}
                                                fontWeight={600}
                                                sx={{ mt: 6, mb: 2 }}>
                                                {section.name}
                                            </Typography>

                                            {section?.intro && section.intro}

                                            {section.fields.map(field =>
                                                !field.showWhen ||
                                                watch(field.showWhen) ? (
                                                    <Box
                                                        sx={{
                                                            ml: field.marginLeft
                                                                ? 5
                                                                : 0,
                                                            mb: field.marginLeft
                                                                ? 4
                                                                : 0,
                                                            p: 0,
                                                        }}>
                                                        <InputWrapper
                                                            key={field.name}
                                                            control={control}
                                                            filterOptions={(
                                                                x: OptionType
                                                            ) => x}
                                                            {...field}
                                                        />
                                                    </Box>
                                                ) : null
                                            )}
                                        </>
                                    );
                                })}

                                <Button type="submit">{t("save")}</Button>
                            </Form>
                        </Paper>
                    ),
                },
                {
                    value: TabValues.PREVIEW,
                    label: t("preview"),
                    content: <p>PREVIEW</p>,
                },
            ]}
        />
    );
};

export default WidgetCreator;
