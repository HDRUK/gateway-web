"use client";

import { useEffect, useMemo, useState } from "react";
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
    onSubmit: (query: string, type: string) => void;
    defaultQuery?: string | string[];
    isDataset: boolean;
}

const PublicationSearchDialog = ({
    onSubmit,
    defaultQuery,
    isDataset,
}: AddDatasetDialogProps) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    console.log('PublicationSearchDialog defaultQuery', defaultQuery);
    console.log('PublicationSearchDialog isDataset', isDataset);
    const { control, getValues, watch } = useForm({
        defaultValues: {
            search: !isDataset && defaultQuery ? defaultQuery : "",
            datasetName: isDataset && defaultQuery ? (isArray(defaultQuery) ? defaultQuery : defaultQuery.split(',')) : [],
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
        name: "datasetName",
        placeholder: t("datasetNameField.placeholder"),
        label: t("datasetNameField.label"),
        // canCreate: false,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => {
            const comp = (option.value === value);
            // console.log('option.value', option.value);
            // console.log('value', value);
            // console.log('comp', comp);
            return comp;
        },
        getChipLabel,
    };

    const [searchParams, setSearchParams] = useState({
        status: "ACTIVE",
        title: isDataset ? getValues("datasetName") : "",
    });

    const [query, setQuery] = useState(
        isDataset && defaultQuery ? (isArray(defaultQuery) ? defaultQuery : defaultQuery.split(',')) : []
    );

    const filterTitleDebounced = useDebounce(isArray(query) ? query.join(',') : query, 500);

    useEffect(() => {
        setSearchParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
        }));
    }, [filterTitleDebounced]);

    const { data: datasetData, isLoading: isLoadingDatasets } = useGet<
        Dataset[]
    >(`${apis.datasetsV1Url}?${new URLSearchParams(searchParams)}`, {
        shouldFetch: hasMinimumSearchCharLength(searchParams.title),
    });

    const searchValue = watch("search");
    const datasetNameValue = watch("datasetName");

    const datasetOptions = useMemo(() => {
        if (!datasetData) return [];

        const x = datasetData.map(data => {
            const datasetTitle = get(
                data,
                "latest_metadata.metadata.metadata.summary.title"
            );

            return {
                label: datasetTitle,
                value: datasetTitle,
            };
        }) as OptionsType[];
        // console.log('datasetOptions is being set to', x);
        return x;
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
                    options={isLoadingDatasets ? [] : datasetOptions}
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
                        console.log('getValues("datasetName")', getValues("datasetName"));
                        console.log('getValues("search")', getValues("search"));
                        onSubmit(
                            getValues("datasetName") ||
                                getValues("search") ||
                                "",
                            searchValue?.length ? "text" : "dataset"
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
