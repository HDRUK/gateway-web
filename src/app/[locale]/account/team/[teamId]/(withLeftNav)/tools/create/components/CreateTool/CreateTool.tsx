"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { Category } from "@/interfaces/Category";
import { Tool, ToolPayload } from "@/interfaces/Tool";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import ResourceTable from "@/components/ResourceTable";
import Typography from "@/components/Typography";
import AddResourceDialog from "@/modules/AddResourceDialog";
import useActionBar from "@/hooks/useActionBar";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    defaultDatasetValue,
    toolDefaultValues,
    toolFormFields,
    toolValidationSchema,
} from "@/config/forms/tool";
import { DataStatus } from "@/consts/application";
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import DatasetRelationshipFields from "../DatasetRelationshipFields";

interface ToolCreateProps {
    teamId: string;
    userId: number;
    toolId?: string;
}

const TRANSLATION_PATH = `pages.account.team.tools.create`;

const CreateTool = ({ teamId, userId, toolId }: ToolCreateProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<ToolPayload>({
            mode: "onTouched",
            resolver: yupResolver(toolValidationSchema),
            defaultValues: {
                ...toolDefaultValues,
            },
        });

    const { data: toolCategoryData } = useGet<Category[]>(
        `${apis.toolCategoriesV1Url}?perPage=200`
    );

    const { data: programmingLanguageData } = useGet<Category[]>(
        `${apis.programmingLanguagesV1Url}?perPage=200`
    );

    const { data: existingToolData } = useGet<Tool>(
        `${apis.toolsV1Url}/${toolId}`,
        {
            shouldFetch: !!toolId,
        }
    );

    const createTool = usePost<ToolPayload>(`${apis.toolsV1Url}`, {
        itemName: "Tool",
    });

    const editTool = usePatch<Partial<ToolPayload>>(`${apis.toolsV1Url}`, {
        itemName: "Tool",
    });

    const toolCategoryOptions = useMemo(() => {
        if (!toolCategoryData) return [];

        return toolCategoryData.map(data => {
            return {
                label: data.name,
                value: data.id,
            };
        }) as OptionsType[];
    }, [toolCategoryData]);

    const programmingLanguageOptions = useMemo(() => {
        if (!programmingLanguageData) return [];

        return programmingLanguageData.map(data => {
            return {
                label: data.name,
                value: data.id,
            };
        }) as OptionsType[];
    }, [programmingLanguageData]);

    useEffect(() => {
        if (!existingToolData) {
            return;
        }

        const formData: ToolPayload = {
            ...existingToolData,
            durs: existingToolData?.durs?.map(item => item.id) || [],
            publications:
                existingToolData?.publications?.map(item => item.id) || [],
            tools: existingToolData?.tools?.map(item => item.id) || [],
            dataset: defaultDatasetValue, // TODO - update this when BE returns dataset linkages correctly
            programming_language:
                existingToolData?.programming_languages?.map(item => item.id) ||
                [],
            type_category:
                existingToolData?.type_category?.map(item => item.id) || [],
        };

        const propertiesToDelete = [
            "programming_languages",
            "mongo_object_id",
            "team_id",
            "collections",
            "license",
            "status",
            "datasets",
            "user",
            "mongo_id",
        ];

        // Remove any legacy tool properties
        propertiesToDelete.forEach(key => {
            if (key in formData) {
                delete formData[key as keyof typeof formData];
            }
        });

        reset(formData);
    }, [reset, existingToolData]);

    const watchAnyDataset = watch("any_dataset");

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "dataset",
    });

    const watchAll = watch();

    const onSubmit = async (formData: ToolPayload) => {
        const payload: ToolPayload = {
            user_id: userId,
            team_id: +teamId,
            ...formData,
            enabled: true,
            tag: [],
            status: DataStatus.ACTIVE,
            durs: formData.durs?.map(item => item.id),
            publications: formData.publications?.map(item => item.id),
            tools: formData.tools?.map(item => item.id),
            dataset: formData.dataset.every(
                obj => Object.keys(obj).length === 0
            )
                ? []
                : formData.dataset,
        };

        if (!toolId) {
            await createTool(payload);
        } else {
            await editTool(toolId, payload);
        }
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue("durs", selectedResources[ResourceType.DATA_USE]);
                setValue(
                    "publications",
                    selectedResources[ResourceType.PUBLICATION]
                );
                setValue("tools", selectedResources[ResourceType.TOOL]);
            },
            hideDatasets: true,
            defaultResources: {
                datause: getValues("durs"),
                publication: getValues("publications"),
                tool: getValues("tools"),
                dataset: [],
            },
        });
    };

    const selectedResources = useMemo(() => {
        return {
            datause: getValues("durs") || [],
            publication: getValues("publications") || [],
            tool: getValues("tools") || [],
            dataset: [],
        };
    }, [watchAll]);

    useEffect(() => {
        showBar("CreateTool", {
            cancelText: t("cancel"),
            confirmText: t("publish"),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(onSubmit)();
                },
                buttonText: t("saveDraft"),
            },
            onSuccess: () => {
                handleSubmit(onSubmit)();
            },
            onCancel: () => {
                const TOOL_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`;
                push(TOOL_ROUTE);
            },
        });
    }, []);

    const handleRemoveResource = (
        _isSelected: boolean,
        data: ResourceDataType,
        resourceType: ResourceType
    ) => {
        const currentResource = selectedResources[resourceType];

        // Add or remove the resource based on isSelected
        const updatedResources = currentResource.filter(
            resource => resource.id !== data.id
        );

        // Update the state with the new list of selected resources
        const type =
            resourceType === ResourceType.DATA_USE
                ? "durs"
                : resourceType === ResourceType.PUBLICATION
                ? "publications"
                : "tools";

        setValue(type, updatedResources as typeof currentResource);
    };

    // Clear dataset when any_dataset toggled
    useEffect(() => {
        if (watchAnyDataset) {
            replace(defaultDatasetValue);
        }
    }, [watchAnyDataset]);

    return (
        <>
            <BoxContainer
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h2">{t("title")}</Typography>
                    <Typography>{t("intro")}</Typography>
                </Box>
                <Box>
                    <Chip
                        resourceType={ResourceType.TOOL}
                        label={t("labelTag")}
                    />
                </Box>
            </BoxContainer>
            <BoxContainer>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Paper>
                        <Box>
                            {toolFormFields.map(field => {
                                if (
                                    field.label ===
                                    "DATASET_RELATIONSHIP_COMPONENT"
                                ) {
                                    return (
                                        <DatasetRelationshipFields
                                            control={control}
                                            fields={fields}
                                            append={append}
                                            remove={remove}
                                            isDisabled={!!watchAnyDataset}
                                        />
                                    );
                                }

                                return (
                                    <InputWrapper
                                        key={field.name}
                                        control={control}
                                        sx={{ mt: 1 }}
                                        {...field}
                                        {...((field.component ===
                                            inputComponents.Autocomplete ||
                                            field.component ===
                                                inputComponents.Select) && {
                                            options:
                                                field.name === "type_category"
                                                    ? toolCategoryOptions
                                                    : field.name ===
                                                      "programming_language"
                                                    ? programmingLanguageOptions
                                                    : field.options || [],
                                        })}
                                    />
                                );
                            })}
                        </Box>
                    </Paper>

                    {/* ADD RESOURCES */}
                    <Paper sx={{ mt: 1, mb: 2 }}>
                        <Box>
                            <Typography variant="h2">
                                {t("addResources")}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                {t("addResourcesInfo")}
                            </Typography>
                            <Divider />
                            <Box sx={{ textAlign: "center", mt: 1 }}>
                                <Button
                                    onClick={handleAddResource}
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<AddIcon />}>
                                    {t("addResourceButton")}
                                </Button>

                                {!!Object.values(selectedResources)?.flat()
                                    ?.length && (
                                    <ResourceTable
                                        selectedResources={selectedResources}
                                        handleRemove={handleRemoveResource}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Form>
            </BoxContainer>
        </>
    );
};

export default CreateTool;
