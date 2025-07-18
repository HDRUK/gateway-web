"use client";

import { useEffect, useMemo, useState } from "react";
import { Control, FieldArrayWithId, FieldValues } from "react-hook-form";
import { IconButton } from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { DatasetRelationship, toolFormArrayFields } from "@/config/forms/tool";
import { AddIcon, RemoveIcon } from "@/consts/icons";

interface OptionType {
    label: string;
    value: string;
}

interface DatasetRelationshipFieldsProps<TFieldValues extends FieldValues> {
    fields: FieldArrayWithId<
        { dataset: DatasetRelationship[] },
        "dataset",
        "item"
    >[];
    control: Control<TFieldValues>;
    remove: (fieldId: number) => void;
    append: (newRow: DatasetRelationship) => void;
    isDisabled: boolean;
}

const TRANSLATION_PATH = `pages.account.team.tools.create`;

const DatasetRelationshipFields = <TFieldValues extends FieldValues>({
    control,
    fields,
    append,
    remove,
    isDisabled,
}: DatasetRelationshipFieldsProps<TFieldValues>) => {
    const t = useTranslations(TRANSLATION_PATH);

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
    >(`${apis.datasetsV2Url}?${new URLSearchParams(queryParams)}`, {
        keepPreviousData: true,
    });

    const datasetOptions = useMemo(() => {
        const fieldsToOptions = fields.reduce((acc, data) => {
            if (data.link_type) {
                acc.push({
                    label: data.label,
                    value: data.value,
                });
            }
            return acc;
        }, [] as OptionsType[]);

        if (!datasetData) return fieldsToOptions;

        const datasetToOptions = datasetData.map(data => {
            return {
                label: get(
                    data,
                    "latest_metadata.metadata.metadata.summary.title"
                ),
                value: data.id,
            };
        }) as OptionsType[];

        // Concatenate and remove value duplicates
        const combinedOptions = [
            ...fieldsToOptions,
            ...datasetToOptions,
        ].filter(
            (option, index, self) =>
                index === self.findIndex(o => o.value === option.value)
        );

        return combinedOptions;
    }, [datasetData, fields]);

    const [relationshipField, datasetTitleField] = toolFormArrayFields;

    return (
        <>
            <Typography mb={1}>{t("relationshipInfo")}</Typography>
            {fields.map((field, index) => (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        p: 0,
                        gap: 2,
                    }}
                    key={field.id}>
                    <Box sx={{ p: 0, gridColumn: "span 2" }}>
                        <InputWrapper
                            {...relationshipField}
                            control={control}
                            name={`dataset.${index}.link_type`}
                            disabled={isDisabled}
                        />
                    </Box>

                    <Box sx={{ p: 0, gridColumn: "span 9" }}>
                        <InputWrapper
                            {...datasetTitleField}
                            control={control}
                            onInputChange={(
                                e: React.ChangeEvent,
                                value: string
                            ) => {
                                if (e?.type !== "change") {
                                    return;
                                }
                                setQuery(value);
                            }}
                            options={isLoadingDatasets ? [] : datasetOptions}
                            filterOptions={(x: OptionType) => x}
                            name={`dataset.${index}.id`}
                            loading={isLoadingDatasets}
                            disabled={isDisabled}
                        />
                    </Box>

                    <Box
                        sx={{
                            p: 0,
                            gridColumn: "span 1",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                        }}>
                        {fields.length > 1 && (
                            <IconButton
                                sx={{ mt: 2, mb: 2 }}
                                edge="start"
                                aria-label="Remove row"
                                onClick={() => remove(index)}
                                disabled={isDisabled}>
                                <RemoveIcon />
                            </IconButton>
                        )}
                        <IconButton
                            aria-label="Add row"
                            sx={{ mt: 2, mb: 2 }}
                            disabled={isDisabled}
                            onClick={() =>
                                append({
                                    link_type: "",
                                    id: undefined,
                                })
                            }>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default DatasetRelationshipFields;
