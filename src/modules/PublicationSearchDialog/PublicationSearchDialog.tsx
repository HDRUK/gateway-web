"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress, Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { get, isArray } from "lodash";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import { getChipLabel } from "@/components/Autocomplete/utils";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { SearchIcon } from "@/consts/icons";
import { hasMinimumSearchCharLength } from "@/utils/search";

const TRANSLATION_PATH = "modules.dialogs.PublicationsSearchDialog";

interface OptionType {
    label: string;
    value: string;
}

interface AddDatasetDialogProps {
    onSubmit: (
        query: string,
        type: string,
        datasetNamesArray: string[]
    ) => void;
    defaultQuery?: string;
    datasetNamesArray?: string[];
    isDataset: boolean;
}

const PublicationSearchDialog = ({
    onSubmit,
    defaultQuery,
    datasetNamesArray,
    isDataset,
}: AddDatasetDialogProps) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const { control, getValues, watch } = useForm({
        defaultValues: {
            search: !isDataset && defaultQuery ? defaultQuery : "",
            datasetNames:
                isDataset && datasetNamesArray ? datasetNamesArray : [],
        },
    });

    const searchFilter = {
        component: inputComponents.TextField,
        variant: "outlined",
        name: "search",
        placeholder: t("searchField.placeholder"),
        icon: SearchIcon,
        label: t("searchField.label"),
    };

    const datasetTitleField = {
        component: inputComponents.Autocomplete,
        name: "datasetNames",
        placeholder: t("datasetNameField.placeholder"),
        label: t("datasetNameField.label"),
        canCreate: false,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => {
            return option.label === value;
        },
        getChipLabel,
    };

    const [searchParams, setSearchParams] = useState({
        status: "ACTIVE",
        title: isDataset ? getValues("datasetNames") : "",
    });

    const [query, setQuery] = useState(
        isDataset
            ? datasetNamesArray
                ? datasetNamesArray.join(",")
                : ""
            : defaultQuery
            ? defaultQuery
            : ""
    );

    const filterTitleDebounced = useDebounce(
        isArray(query) ? query.join(",") : query,
        500
    );

    useEffect(() => {
        setSearchParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
        }));
    }, [filterTitleDebounced]);

    const { data: datasetData = [], isLoading: isLoadingDatasets } = useGet<
        Dataset[]
    >(`${apis.datasetsV1Url}?${new URLSearchParams(searchParams)}`, {
        shouldFetch: hasMinimumSearchCharLength(searchParams.title),
    });

    const searchValue = watch("search");
    const datasetNameValue = watch("datasetNames");

    const [datasetOptions, setDatasetOptions] = useState<OptionsType[]>([]);

    const updateDatasetOptions = (
        prevOptions: OptionsType[],
        datasetOptions: OptionsType[]
    ) => {
        const existingDatasetIds = prevOptions.map(option => option.label);
        const newOptions = datasetOptions?.filter(
            option => !existingDatasetIds.includes(option.label)
        );
        if (newOptions && newOptions.length) {
            return [...prevOptions, ...newOptions].sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }
        return prevOptions;
    };

    useEffect(() => {
        const datasetOptions = datasetData?.map(dataset => {
            const datasetTitle = get(
                dataset,
                "latest_metadata.metadata.metadata.summary.title"
            );
            return {
                value: datasetTitle,
                label: datasetTitle,
            };
        }) as OptionsType[];

        setDatasetOptions(prevOptions =>
            updateDatasetOptions(prevOptions, datasetOptions)
        );
    }, [datasetData]);

    return (
        <Dialog maxWidth="tablet" title="">
            <MuiDialogContent sx={{ p: 10 }}>
                <Typography sx={{ mb: 4 }}>{t("intro")}</Typography>

                <InputWrapper
                    control={control}
                    {...searchFilter}
                    disabled={!!datasetNameValue?.length}
                />
                <Typography
                    fontWeight={700}
                    textAlign="center"
                    sx={{ mt: 2, mb: 2 }}>
                    OR
                </Typography>
                <InputWrapper
                    {...datasetTitleField}
                    control={control}
                    onInputChange={(e: React.ChangeEvent, value: string) => {
                        if (value === "") {
                            setQuery(value);
                            return;
                        }
                        if (e?.type !== "change") {
                            return;
                        }
                        setQuery(value);
                    }}
                    options={datasetOptions || []}
                    filterOptions={(x: OptionType) => x}
                    loading={isLoadingDatasets}
                    disabled={!!searchValue?.length}
                    popupIcon={
                        isLoadingDatasets && (
                            <CircularProgress
                                size={20}
                                color="secondary"
                                sx={{ mt: 0.5 }}
                            />
                        )
                    }
                />
            </MuiDialogContent>

            <MuiDialogActions
                sx={{ p: 3, pt: 1, justifyContent: "space-between" }}>
                <Button onClick={() => hideDialog()} color="greyCustom">
                    {t("cancel")}
                </Button>
                <Button
                    onClick={() => {
                        onSubmit(
                            getValues("datasetNames") ||
                                getValues("search") ||
                                "",
                            searchValue?.length ? "text" : "dataset",
                            getValues("datasetNames")
                        );
                        hideDialog();
                    }}>
                    {t("search")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default PublicationSearchDialog;
