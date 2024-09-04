"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import RadioGroup from "@/components/RadioGroup";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { getColumns } from "@/config/tables/addResources";
import { colors } from "@/config/theme";
import { capitalise } from "@/utils/general";
import { resourceTypes, defaultValues, searchResource } from "./config";

const TRANSLATION_PATH = "modules.dialogs.RelatedResources";

interface AddDatasetDialogProps {
    defaultResources?: SelectedResources;
    setResources: (selectedResources: SelectedResources) => void;
}

const AddDatasetDialog = ({
    defaultResources,
    setResources,
}: AddDatasetDialogProps) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const tableTranslations = {
        headerAdd: t("headerAdd"),
        headerName: t("headerName"),
        dataProvider: t("dataProvider"),
        entityType: t("entityType"),
        chipdataset: t("chipDataset"),
        chipdatause: t("chipDatause"),
        chippublication: t("chipPublication"),
        chiptool: t("chipTool"),
    };

    const [queryParams, setQueryParams] = useState({
        status: "ACTIVE",
        title: "",
    });

    const [resourceType, setResourceType] = useState<ResourceType>(
        ResourceType.DATA_USE
    );

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...defaultValues,
            resourceType: defaultResources?.[ResourceType.DATASET]
                ? ResourceType.DATASET
                : defaultResources?.[ResourceType.DATA_USE]
                ? ResourceType.DATA_USE
                : defaultResources?.[ResourceType.PUBLICATION]
                ? ResourceType.PUBLICATION
                : ResourceType.TOOL,
        },
    });

    const watchAll = watch();
    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            sort: `${watchAll.sortField}`,
        }));
    }, [watchAll.sortField, setValue]);

    const filterTitleDebounced = useDebounce(watchAll.searchTitle, 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
            page: "1",
        }));
    }, [filterTitleDebounced]);

    useEffect(() => {
        setResourceType(watchAll.resourceType);
    }, [watchAll.resourceType]);

    const { data: datasetData, isLoading: isLoadingDatasets } = useGet<
        Dataset[]
    >(`${apis.datasetsV1Url}?${new URLSearchParams(queryParams)}`, {
        shouldFetch: resourceType === ResourceType.DATASET,
    });

    const { data: datauseData, isLoading: isLoadingDatauses } = useGet<
        DataUse[]
    >(
        `${apis.dataUseV1Url}?${new URLSearchParams({
            project_title: queryParams.title,
        })}`,
        {
            shouldFetch: resourceType === ResourceType.DATA_USE,
        }
    );

    const { data: publicationData, isLoading: isLoadingPublications } = useGet<
        Publication[]
    >(
        `${apis.publicationsV1Url}?${new URLSearchParams({
            paper_title: queryParams.title,
            status: "ACTIVE",
        })}`,
        {
            shouldFetch: resourceType === ResourceType.PUBLICATION,
        }
    );

    const { data: toolData, isLoading: isLoadingTools } = useGet<Tool[]>(
        `${apis.toolsV1Url}?${new URLSearchParams({
            title: queryParams.title,
            status: "ACTIVE",
        })}`,
        {
            shouldFetch: resourceType === ResourceType.TOOL,
        }
    );

    const data = useMemo(() => {
        const dataMap = {
            [ResourceType.DATASET]: datasetData,
            [ResourceType.DATA_USE]: datauseData,
            [ResourceType.PUBLICATION]: publicationData,
            [ResourceType.TOOL]: toolData,
        };
        return dataMap[resourceType];
    }, [resourceType, datasetData, datauseData, publicationData, toolData]);

    const isLoading = useMemo(() => {
        return (
            isLoadingDatasets ||
            isLoadingDatauses ||
            isLoadingPublications ||
            isLoadingTools
        );
    }, [
        isLoadingDatasets,
        isLoadingDatauses,
        isLoadingPublications,
        isLoadingTools,
    ]);

    const availableResourceTypes = useMemo(() => {
        return [
            ResourceType.DATASET,
            ResourceType.DATA_USE,
            ResourceType.PUBLICATION,
            ResourceType.TOOL,
        ].filter(type => defaultResources?.[type]);
    }, [defaultResources]);

    const [selectedResources, setSelectedResources] =
        useState<SelectedResources>({
            [ResourceType.DATASET]:
                defaultResources?.[ResourceType.DATASET] || [],
            [ResourceType.DATA_USE]:
                defaultResources?.[ResourceType.DATA_USE] || [],
            [ResourceType.PUBLICATION]:
                defaultResources?.[ResourceType.PUBLICATION] || [],
            [ResourceType.TOOL]: defaultResources?.[ResourceType.TOOL] || [],
        });

    const handleCheckbox = (isSelected: boolean, data: ResourceDataType) => {
        const currentResource = selectedResources[resourceType];

        if (!currentResource) {
            return;
        }

        // Add or remove the resource based on isSelected
        const updatedResources = isSelected
            ? [...currentResource, data]
            : currentResource.filter(resource => resource.id !== data.id);

        // Update the state with the new list of selected resources
        setSelectedResources({
            ...selectedResources,
            [resourceType]: updatedResources,
        });
    };

    return (
        <Dialog title={t("title")} maxWidth="laptop">
            <MuiDialogContent sx={{ minHeight: "55vh" }}>
                <Typography color={colors.grey600}>{t("intro")}</Typography>

                <InputWrapper
                    setValue={setValue}
                    control={control}
                    {...searchResource}
                    sx={{ mt: 2 }}
                />

                <RadioGroup
                    isRow
                    name="resourceType"
                    label="Search for:"
                    control={control}
                    radios={resourceTypes
                        .filter(radio => availableResourceTypes.includes(radio))
                        .map(type => ({
                            value: type,
                            label: t(`radio${capitalise(type)}`),
                        }))}
                />

                {isLoading && <Loading />}

                {!isLoading && (
                    <>
                        {!!data?.length && (
                            <>
                                <Typography>
                                    {data?.length} {t("resultsShown")}
                                </Typography>
                                <Box
                                    sx={{
                                        maxHeight: "38vh",
                                        overflowY: "scroll",
                                        mt: 1,
                                    }}>
                                    <Table
                                        columns={getColumns({
                                            handleAddResource: handleCheckbox,
                                            resourceType,
                                            selectedResources,
                                            tableTranslations,
                                        })}
                                        rows={data || []}
                                    />
                                </Box>
                            </>
                        )}
                        {!data?.length && (
                            <Typography>{t("noResults")}</Typography>
                        )}
                    </>
                )}
            </MuiDialogContent>

            <MuiDialogActions
                sx={{ p: 3, pt: 1, justifyContent: "space-between" }}>
                <Typography>
                    {Object.values(selectedResources).flat().length}{" "}
                    {t("selected")}
                </Typography>
                <Box
                    sx={{
                        gap: 2,
                        p: 0,
                        display: "flex",
                        flexDirection: "row",
                    }}>
                    <Button onClick={() => hideDialog()} color="greyCustom">
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={() => {
                            setResources(selectedResources);
                            hideDialog();
                        }}>
                        {t("addResources")}
                    </Button>
                </Box>
            </MuiDialogActions>
        </Dialog>
    );
};

export default AddDatasetDialog;
