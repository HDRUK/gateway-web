"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { OptionType } from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { TeamNames } from "@/interfaces/Team";
import { Unit, Widget, WidgetResponse } from "@/interfaces/Widget";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";

interface WidgetCreatorProps {
    widget?: Widget;
    teamId: string;
    teamNames: TeamNames[];
}

interface HasFields {
    has_datasets?: boolean;
    has_datauses?: boolean;
    has_scripts?: boolean;
    has_collections?: boolean;
}

function filterSelectedByTeam<T>(
    selectedIds: number[] | undefined,
    items: T[] | undefined,
    getId: (item: T) => number,
    getTeamId: (item: T) => number | undefined,
    allowedTeams: Set<string>
): number[] {
    if (!Array.isArray(selectedIds) || !selectedIds.length || !items?.length) {
        return selectedIds ?? [];
    }

    return selectedIds.filter(selId => {
        const match = items.find(it => String(getId(it)) === String(selId));
        if (!match) return false;
        const team = getTeamId(match);
        return team != null && allowedTeams.has(String(team));
    });
}

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;
const DATA_CUSTODIAN_LIMIT = 25;

enum TabValues {
    CONFIGURATION = "configuration",
    PREVIEW = "preview",
}

const unitOptions: { value: Unit; label: string }[] = Object.values(Unit).map(
    u => ({ value: u, label: u })
);

const getChipLabel = (options, value) =>
    options.find(option => option.value.toString() === value)?.label;

const isOptionEqualToValue = (
    option: { value: string | number; label: string },
    value: string | number
) => option.value === value;

const WidgetCreator = ({ widget, teamId, teamNames }: WidgetCreatorProps) => {
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);

    const teamNameOptions = useMemo(
        () =>
            teamNames.map(team => ({
                value: team.id.toString(),
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
        getValues,
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
            include_search_bar: false,
            include_cohort_link: false,
            size_width: 0,
            size_height: 0,
            unit: Unit.PX,
            widget_name: "",
            ...widget,
            has_datasets: widget?.included_datasets.length > 0,
            has_data_custodians: true,
            has_datauses: widget?.included_data_uses.length > 0,
            has_scripts: widget?.included_scripts.length > 0,
            has_collections: widget?.included_collections.length > 0,
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
                        )
                        .max(DATA_CUSTODIAN_LIMIT),
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

    const { data: entityData, isLoading: loadingEntityData } =
        useGet<WidgetResponse>(
            `${apis.teamsV1Url}/${teamId}/widgets/data?team_ids=${watch(
                "data_custodian_entities_ids"
            )}`,
            { shouldFetch: !!watch("data_custodian_entities_ids")?.length }
        );

    const [entityDataCache, setEntityDataCache] = useState<
        WidgetResponse | undefined
    >();

    useEffect(() => {
        if (!loadingEntityData) {
            setEntityDataCache(entityData);
        }
    }, [entityData, loadingEntityData]);

    const selectedCustodianIds = watch("data_custodian_entities_ids") ?? [];
    const allowedTeamIdSet = useMemo(
        () => new Set(selectedCustodianIds.map(String)), // everything as string for comparisons
        [selectedCustodianIds]
    );

    const createWidget = usePost<Widget>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );

    const updateWidget = usePatch<Partial<Widget>>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );

    const formatEntityOptions = useCallback(
        (entityType: string, valueKey: string, labelKey: string) =>
            entityDataCache?.[entityType]?.map(entity => ({
                value: entity?.[valueKey].toString(),
                label: entity?.[labelKey],
                team: entity?.team_name,
                teamId: entity?.team_id,
            })),
        [entityDataCache]
    );

    const selectAllOptions = (formValue: string, entityType: string) =>
        setValue(
            formValue,
            entityDataCache?.[entityType]?.map(d => d.id.toString()),
            { shouldDirty: true }
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
                        inputProps: { readOnly: true },
                        onChange: () =>
                            setValue("has_data_custodians", true, {
                                shouldDirty: false,
                            }),
                        value: true,
                    },
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
                                    selectAllOptions(
                                        "included_data_uses",
                                        "durs"
                                    )
                                }
                                variant="link">
                                Select all
                            </Button>
                        ),
                        chipColor: "success", // 🔽 only show options whose teamId is in the selected custodians (or all if none selected)
                        // filterOptions: (
                        //     options: Array<{
                        //         value: string;
                        //         label: string;
                        //         teamId?: number;
                        //     }>
                        // ) =>
                        //     options.filter(
                        //         o =>
                        //             o.teamId != null &&
                        //             allowedTeamIdSet.has(String(o.teamId))
                        //     ),
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
                                    selectAllOptions(
                                        "included_scripts",
                                        "tools"
                                    )
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
                        options: formatEntityOptions(
                            "collections",
                            "id",
                            "name"
                        ),
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
                    // {
                    //     name: "keep_proportions",
                    //     label: "Keep proportions",
                    //     component: inputComponents.Checkbox,
                    // },
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
        [
            formatEntityOptions,
            selectAllOptions,
            setValue,
            t,
            teamNameOptions,
            watch,
        ]
    );

    const onSubmit = async (values: Widget & HasFields) => {
        // Remove any entities if unchecked
        const cleanPayload = (payload: Partial<Widget> & HasFields) => {
            const updatedPayload = payload;

            if (updatedPayload.has_datasets === false) {
                updatedPayload.included_datasets = [];
            }

            if (updatedPayload.has_datauses === false) {
                updatedPayload.included_data_uses = [];
            }

            if (updatedPayload.has_scripts === false) {
                updatedPayload.included_scripts = [];
            }

            if (updatedPayload.has_collections === false) {
                updatedPayload.included_collections = [];
            }

            // Remove has_* fields after processing
            delete updatedPayload.has_datasets;
            delete updatedPayload.has_datauses;
            delete updatedPayload.has_scripts;
            delete updatedPayload.has_collections;

            return updatedPayload as Widget;
        };

        if (!widget) {
            createWidget(cleanPayload(values));
        } else {
            const payload = Object.fromEntries(
                (Object.entries(dirtyFields) as [keyof Widget, boolean][]).map(
                    ([k]) => [k, values[k] as Widget[typeof k]]
                )
            ) as Partial<Widget>;

            updateWidget(
                widget.id,
                cleanPayload({
                    ...payload,
                    has_datasets: watch("has_datasets"),
                    has_datauses: watch("has_datauses"),
                    has_scripts: watch("has_scripts"),
                    has_collections: watch("has_collections"),
                })
            );
        }

        router.push(
            `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`
        );
    };

    const custodians = watch("data_custodian_entities_ids");
    const includedDatasets = watch("included_datasets");
    const includedDatause = watch("included_data_uses");
    const includedScripts = watch("included_scripts");
    const includedCollections = watch("included_collections");

    const allowedTeams = useMemo(
        () => new Set((custodians ?? []).map(String)),
        [custodians]
    );

    // Remove any entities belonging to teams that have been removed
    useEffect(() => {
        if (!entityDataCache) return;

        const filteredDatasets = filterSelectedByTeam(
            includedDatasets,
            entityDataCache.datasets,
            d => d.id,
            d => d.team_id,
            allowedTeams
        );
        if (
            (filteredDatasets?.length ?? 0) !== (includedDatasets?.length ?? 0)
        ) {
            setValue("included_datasets", filteredDatasets, {
                shouldDirty: true,
            });
        }

        const filteredDatauses = filterSelectedByTeam(
            includedDatause,
            entityDataCache.durs,
            d => d.id,
            d => d.team_id,
            allowedTeams
        );
        if (
            (filteredDatauses?.length ?? 0) !== (includedDatause?.length ?? 0)
        ) {
            setValue("included_data_uses", filteredDatauses, {
                shouldDirty: true,
            });
        }

        const filteredScripts = filterSelectedByTeam(
            includedScripts,
            entityDataCache.tools,
            t => t.id,
            t => t.team_id,
            allowedTeams
        );
        if ((filteredScripts?.length ?? 0) !== (includedScripts?.length ?? 0)) {
            setValue("included_scripts", filteredScripts, {
                shouldDirty: true,
            });
        }

        const filteredCollections = filterSelectedByTeam(
            includedCollections,
            entityDataCache.collections,
            c => c.id,
            c => c.team_id,
            allowedTeams
        );
        if (
            (filteredCollections?.length ?? 0) !==
            (includedCollections?.length ?? 0)
        ) {
            setValue("included_collections", filteredCollections, {
                shouldDirty: true,
            });
        }
    }, [
        entityDataCache,
        allowedTeams,
        includedDatasets,
        includedDatause,
        includedScripts,
        includedCollections,
        setValue,
    ]);

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
                                {configSections.map(section => (
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
                                                        ...(field.inline && {
                                                            display:
                                                                "inline-block",
                                                            mr: 2,
                                                            maxWidth: 100,
                                                        }),
                                                    }}>
                                                    <InputWrapper
                                                        key={field.name}
                                                        control={control}
                                                        filterOptions={(
                                                            x: OptionType
                                                        ) => x}
                                                        {...field}
                                                    />
                                                    {field.selectAllButton &&
                                                        field.selectAllButton}
                                                </Box>
                                            ) : null
                                        )}
                                    </>
                                ))}

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
