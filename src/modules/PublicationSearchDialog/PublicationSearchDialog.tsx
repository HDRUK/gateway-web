"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress, Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { SearchIcon } from "@/consts/icons";

const TRANSLATION_PATH = "modules.dialogs.PublicationsSearchDialog";

interface OptionType {
    label: string;
    value: string;
}

interface AddDatasetDialogProps {
    onSubmit: (query: string, type: string) => void;
    defaultQuery?: string;
    isDataset: boolean;
}

const PublicationSearchDialog = ({
    onSubmit,
    defaultQuery,
    isDataset,
}: AddDatasetDialogProps) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const { control, getValues, watch } = useForm({
        defaultValues: {
            search: !isDataset && defaultQuery ? defaultQuery : "",
            datasetName: isDataset && defaultQuery ? defaultQuery : "",
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
    };

    const [searchParams, setSearchParams] = useState({
        status: "ACTIVE",
        title: isDataset ? getValues("datasetName") : "",
    });

    const [query, setQuery] = useState(
        isDataset && defaultQuery ? defaultQuery : ""
    );

    const filterTitleDebounced = useDebounce(query, 500);

    useEffect(() => {
        setSearchParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
        }));
    }, [filterTitleDebounced]);

    const { data: datasetData, isLoading: isLoadingDatasets } = useGet<
        Dataset[]
    >(`${apis.datasetsV1Url}?${new URLSearchParams(searchParams)}`, {
        shouldFetch: searchParams.title?.length > 2,
    });

    const searchValue = watch("search");
    const datasetNameValue = watch("datasetName");

    const datasetOptions = useMemo(() => {
        if (!datasetData) return [];

        return datasetData.map(data => {
            const datasetTitle = get(
                data,
                "latest_metadata.metadata.metadata.summary.title"
            );

            return {
                label: datasetTitle,
                value: datasetTitle,
            };
        }) as OptionsType[];
    }, [datasetData]);

    return (
        <Dialog maxWidth="tablet" title="">
            <MuiDialogContent sx={{ p: 10 }}>
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

                <Typography>({t("helper")})</Typography>
            </MuiDialogContent>

            <MuiDialogActions
                sx={{ p: 3, pt: 1, justifyContent: "space-between" }}>
                <Button onClick={() => hideDialog()} color="greyCustom">
                    {t("cancel")}
                </Button>
                <Button
                    onClick={() => {
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
