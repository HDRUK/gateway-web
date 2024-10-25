"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { get, isEqual } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { DataUse, DatasetWithTitle } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Keyword } from "@/interfaces/Keyword";
import Accordion from "@/components/Accordion";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import useActionBar from "@/hooks/useActionBar";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    dataUseDefaultValues,
    dataUseFormFields,
    dataUseValidationSchema,
} from "@/config/forms/dataUse";
import { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const EditDataUse = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.EditDataUse`
    );

    const [datasetSearchCache, setDatasetSearchCache] = useState<
        DatasetWithTitle[]
    >([]);

    const params = useParams<{
        teamId: string;
        dataUseId: string;
    }>();
    const { push } = useRouter();
    const { showBar } = useActionBar();

    const { data: keywords } = useGet<Keyword[]>(
        `${apis.keywordsV1Url}?perPage=-1`
    );

    const { data } = useGet<DataUse[]>(
        `${apis.dataUseV1Url}/${params?.dataUseId}`,
        { shouldFetch: !!params?.dataUseId }
    );
    const existingDataUse = useMemo(() => data?.[0], [data]);

    const mapKeywords = (keywords: Keyword[]) =>
        keywords.map(keyword => keyword.name);

    const mapDatasets = (datasets: DatasetWithTitle[]) =>
        datasets.flatMap(dataset => ({
            label: dataset.shortTitle,
            value: dataset.id,
        }));

    const { control, handleSubmit, reset } = useForm<DataUse>({
        mode: "onTouched",
        resolver: yupResolver(dataUseValidationSchema),
        defaultValues: dataUseDefaultValues,
    });

    useEffect(() => {
        if (!existingDataUse) {
            return;
        }

        setDatasetSearchCache(existingDataUse?.datasets as DatasetWithTitle[]);

        const formData = {
            ...existingDataUse,
            project_start_date: existingDataUse?.project_start_date
                ? dayjs(existingDataUse.project_start_date)
                : null,
            project_end_date: existingDataUse?.project_end_date
                ? dayjs(existingDataUse.project_end_date)
                : null,
            latest_approval_date: existingDataUse?.latest_approval_date
                ? dayjs(existingDataUse.latest_approval_date)
                : null,
            access_date: existingDataUse?.access_date
                ? dayjs(existingDataUse.access_date)
                : null,
            keywords: existingDataUse?.keywords
                ? mapKeywords(existingDataUse.keywords as Keyword[])
                : [],
            datasets: existingDataUse?.datasets
                ? mapDatasets(existingDataUse.datasets as DatasetWithTitle[])
                : [],
        };
        reset(formData);
    }, [reset, existingDataUse]);

    const editDataUse = usePut<Partial<DataUse>>(`${apis.dataUseV1Url}`, {
        itemName: "Application",
    });

    const getChangedFields = <T extends DataUse>(
        original: T,
        updated: T
    ): Partial<T> => {
        return Object.keys(original).reduce((changes, key) => {
            if (!isEqual(original[key as keyof T], updated[key as keyof T])) {
                return {
                    ...changes,
                    [key]: updated[key as keyof T],
                };
            }
            return changes;
        }, {} as Partial<T>);
    };

    const submitForm = async (formData: DataUse, status: DataStatus) => {
        if (!existingDataUse) {
            return;
        }

        const edited = {
            ...formData,
            project_start_date: formData.project_start_date
                ? dayjs(formData.project_start_date).format(
                      "YYYY-MM-DDThh:mm:ss"
                  )
                : null,
            project_end_date: formData.project_end_date
                ? dayjs(formData.project_end_date).format("YYYY-MM-DDThh:mm:ss")
                : null,
            latest_approval_date: formData.latest_approval_date
                ? dayjs(formData.latest_approval_date).format(
                      "YYYY-MM-DDThh:mm:ss"
                  )
                : null,
            access_date: formData.access_date
                ? dayjs(formData.access_date).format("YYYY-MM-DDThh:mm:ss")
                : null,
            status,
            datasets: formData.datasets.map(number => ({ id: number })),
        };

        const formUpdates: Partial<DataUse> = getChangedFields(
            existingDataUse,
            edited
        );

        const response = await editDataUse(params!.dataUseId, formUpdates);

        if (response) {
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_USES}`
            );
        }
    };

    const handleCancel = () => {
        push(
            `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_USES}`
        );
    };

    const [keywordOptions, setKeywordsOptions] = useState<string[]>([]);
    const [outputOptions, setOutputOptions] = useState<string[]>([]);

    useEffect(() => {
        if (!keywords) {
            return;
        }

        setKeywordsOptions(keywords.map(keyword => keyword.name));
    }, [keywords]);

    const existingResearchLinks = existingDataUse?.non_gateway_outputs;

    useEffect(() => {
        if (!existingResearchLinks) {
            return;
        }

        setOutputOptions(existingResearchLinks);
    }, [existingResearchLinks]);

    useEffect(() => {
        showBar("CreateDataUse", {
            cancelText: t("cancel"),
            confirmText: t("publish"),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(formData =>
                        submitForm(formData, DataStatus.DRAFT)
                    )();
                },
                buttonText: t("saveDraft"),
                buttonProps: {
                    color: "secondary",
                    variant: "outlined",
                },
            },
            onSuccess: () => {
                handleSubmit(formData =>
                    submitForm(formData, DataStatus.ACTIVE)
                )();
            },
            onCancel: () => {
                handleCancel();
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSubmit, params?.teamId, t, existingDataUse]);

    const getOptions = (fieldName: string) => {
        if (fieldName === "keywords") {
            return keywordOptions;
        }
        if (fieldName === "non_gateway_outputs") {
            return outputOptions;
        }
        return [];
    };

    const [query, setQuery] = useState("");

    const [queryParams, setQueryParams] = useState({
        status: "ACTIVE",
        searchTitle: "",
    });

    const filterTitleDebounced = useDebounce(query, 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
        }));
    }, [filterTitleDebounced]);

    const { data: datasetData, isLoading: isLoadingDatasets } = useGet<
        Dataset[]
    >(`${apis.datasetsV1Url}?${new URLSearchParams(queryParams)}`, {
        keepPreviousData: true,
    });
    const datasetOptions = useMemo(() => {
        if (!datasetData) return [];

        setDatasetSearchCache([
            ...datasetSearchCache,
            ...(datasetData as unknown as DatasetWithTitle[]),
        ]);

        return datasetData.map(data => ({
            label: get(
                data,
                "latest_metadata.metadata.metadata.summary.shortTitle"
            ),
            value: data.id,
        })) as OptionsType[];
    }, [datasetData]);

    const datasetField = useCallback(
        field => (
            <InputWrapper
                key={field.name}
                control={control}
                {...field}
                options={isLoadingDatasets ? [] : datasetOptions}
                onInputChange={(e: ChangeEvent, value: string) => {
                    if (e?.type !== "change") return;
                    setQuery(value);
                }}
                loading={isLoadingDatasets}
                getChipLabel={(
                    _: { value: string | number; label: string }[],
                    value: { label: string; value: number } | number
                ) => {
                    const option = datasetSearchCache.find(
                        d =>
                            d.id ===
                            (typeof value === "object" ? value.value : value)
                    );

                    return (
                        get(
                            option,
                            "latest_metadata.metadata.metadata.summary.shortTitle"
                        ) || get(option, "shortTitle")
                    );
                }}
            />
        ),
        [isLoadingDatasets, datasetOptions, datasetSearchCache]
    );

    return (
        <>
            <Box sx={{ bgcolor: "white", mb: 0 }}>
                <Typography variant="h2">{t("editDataUse")}</Typography>
            </Box>

            <Form>
                <Box>
                    {dataUseFormFields.map(section => {
                        return (
                            <Accordion
                                key={section.sectionName}
                                sx={{
                                    ".MuiAccordionSummary-root": {
                                        background: colors.purple400,
                                        color: colors.white,
                                    },
                                    ".MuiSvgIcon-root.MuiSvgIcon-colorPrimary":
                                        {
                                            color: colors.white,
                                        },
                                }}
                                heading={
                                    <Typography variant="h4" sx={{ m: 0 }}>
                                        {section.sectionName}
                                    </Typography>
                                }
                                contents={section.fields.map(field => (
                                    <Box
                                        sx={{
                                            p: 0,
                                            gridColumn: "span 3",
                                        }}>
                                        {field.name !== "datasets" ? (
                                            <InputWrapper
                                                key={field.name}
                                                control={control}
                                                {...field}
                                                {...(field.component ===
                                                    inputComponents.Autocomplete && {
                                                    options: getOptions(
                                                        field.name
                                                    ),
                                                })}
                                            />
                                        ) : (
                                            datasetField(field)
                                        )}
                                    </Box>
                                ))}
                            />
                        );
                    })}
                </Box>
            </Form>
        </>
    );
};

export default EditDataUse;
