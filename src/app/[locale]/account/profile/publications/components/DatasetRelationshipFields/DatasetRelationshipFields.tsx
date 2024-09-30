"use client";

import { useEffect, useMemo, useState } from "react";
import { Control, FieldArrayWithId, FieldValues } from "react-hook-form";
import { IconButton } from "@mui/material";
import { get } from "lodash";
import { Dataset } from "@/interfaces/Dataset";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    DatasetRelationship,
    publicationFormArrayFields,
} from "@/config/forms/publication";
import { AddIcon, RemoveIcon } from "@/consts/icons";

interface OptionType {
    label: string;
    value: string;
}

interface DatasetRelationshipFieldsProps<TFieldValues extends FieldValues> {
    fields: FieldArrayWithId<
        { datasets: DatasetRelationship[] },
        "datasets",
        "item"
    >[];
    control: Control<TFieldValues>;
    remove: (fieldId: number) => void;
    append: (newRow: DatasetRelationship) => void;
    isDisabled: boolean;
}

const DatasetRelationshipFields = <TFieldValues extends FieldValues>({
    control,
    fields,
    append,
    remove,
    isDisabled,
}: DatasetRelationshipFieldsProps<TFieldValues>) => {
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

        return datasetData.map(data => {
            return {
                label: get(
                    data,
                    "latest_metadata.metadata.metadata.summary.title"
                ),
                value: data.id,
            };
        }) as OptionsType[];
    }, [datasetData]);

    const [relationshipField, datasetTitleField] = publicationFormArrayFields;

    return (
        <>
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
                            name={`datasets.${index}.link_type`}
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
                            name={`datasets.${index}.id`}
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
