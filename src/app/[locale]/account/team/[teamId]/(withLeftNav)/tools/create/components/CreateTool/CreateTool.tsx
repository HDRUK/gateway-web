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
import { DataUse } from "@/interfaces/DataUse";
import { ProgrammingLanguage } from "@/interfaces/ProgrammingLanguage";
import { Publication } from "@/interfaces/Publication";
import { Tag } from "@/interfaces/Tag";
import { Tool, ToolPayload, ToolPayloadSubmission } from "@/interfaces/Tool";
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
import { ValueType } from "@/components/Autocomplete/Autocomplete";

interface ToolCreateProps {
    teamId?: string;
    userId: number;
    toolId?: string;
}

const TRANSLATION_PATH = `pages.account.team.tools.create`;

const CreateTool = ({ teamId, userId, toolId }: ToolCreateProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();

    const TOOL_ROUTE = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}`;

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

    const { data: programmingLanguageData } = useGet<ProgrammingLanguage[]>(
        `${apis.programmingLanguagesV1Url}?perPage=200`
    );

    const { data: tagData } = useGet<Tag[]>(`${apis.tagsV1Url}?per_page=200`);

    const { data: existingToolData } = useGet<Tool>(
        `${apis.toolsV1Url}/${toolId}`,
        {
            shouldFetch: !!toolId,
        }
    );

    const createTool = usePost<ToolPayloadSubmission>(`${apis.toolsV1Url}`, {
        itemName: "Tool",
    });

    const editTool = usePatch<Partial<ToolPayloadSubmission>>(
        `${apis.toolsV1Url}`,
        {
            itemName: "Tool",
        }
    );

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

    const tagOptions = useMemo(() => {
        if (!tagData) return [];

        return tagData.map(data => {
            return {
                value: data.id as ValueType,
                label: data.description,
            };
        }) as OptionsType[];
    }, [tagData]);

    useEffect(() => {
        if (!existingToolData) {
            return;
        }

        const formData = {
            ...existingToolData,
            dataset: existingToolData.datasets,
            programming_language:
                existingToolData?.programming_languages?.map(item => item.id) ||
                [],
            type_category:
                existingToolData?.type_category?.map(item => item.id) || [],
            keywords:
                existingToolData?.tag?.map(item => 
                    item.id,
                ) || [],
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

        reset(formData as ToolPayload);
    }, [reset, existingToolData]);

    const watchAnyDataset = watch("any_dataset");

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "dataset",
    });

    const watchAll = watch();

    const onSubmit = async (formData: ToolPayload, status: DataStatus) => {
        const formatEntityToIdArray = (
            data: DataUse[] | Publication[] | Tool[]
        ) => {
            if (
                Array.isArray(data) &&
                data.every(item => typeof item === "number")
            ) {
                return data;
            }

            return data?.map(item => item?.id);
        };

        const publications = formData.publications.map(
            ({ updated_at, created_at, ...item }) => item
        );

        const payload: ToolPayloadSubmission = {
            ...formData,
            user_id: userId,
            team_id: teamId ? +teamId : undefined,
            enabled: true,
            tag: formData.keywords,
            status,
            durs: formatEntityToIdArray(formData.durs),
            publications: publications,
            tools: formatEntityToIdArray(formData.tools),
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

        push(TOOL_ROUTE);
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue("durs", selectedResources[ResourceType.DATA_USE]);
                setValue(
                    "publications",
                    selectedResources[ResourceType.PUBLICATION]
                );
            },
            defaultResources: {
                datause: getValues("durs"),
                publication: getValues("publications"),
            },
        });
    };

    const selectedResources = useMemo(() => {
        return {
            datause: (getValues("durs") as DataUse[]) || [],
            publication: (getValues("publications") as Publication[]) || [],
            tool: (getValues("tools") as Tool[]) || [],
            dataset: [],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchAll, getValues]);

    useEffect(() => {
        showBar("CreateTool", {
            cancelText: t("cancel"),
            confirmText: t("publish"),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(formData =>
                        onSubmit(formData, DataStatus.DRAFT)
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
                    onSubmit(formData, DataStatus.ACTIVE)
                )();
            },
            onCancel: () => {
                push(TOOL_ROUTE);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRemoveResource = (
        data: ResourceDataType,
        resourceType: ResourceType
    ) => {
        const currentResource = selectedResources[resourceType];

        // Add or remove the resource based on isSelected
        const updatedResources = currentResource.filter(
            resource => resource.id !== data.id
        );

        // Update the state with the new list of selected resources
        if (resourceType === ResourceType.DATA_USE) {
            setValue("durs", updatedResources as DataUse[]);
        } else if (resourceType === ResourceType.PUBLICATION) {
            setValue("publications", updatedResources as Publication[]);
        } else if (resourceType === ResourceType.TOOL) {
            setValue("tools", updatedResources as Tool[]);
        }
    };

    // Clear dataset when any_dataset toggled
    useEffect(() => {
        if (watchAnyDataset) {
            replace(defaultDatasetValue);
        }
    }, [replace, watchAnyDataset]);

    const hydratedFormFields = useMemo(
        () =>
            toolFormFields.map(field => {
                if (field.label === "DATASET_RELATIONSHIP_COMPONENT") {
                    return (
                        <DatasetRelationshipFields
                            key={field.label}
                            control={control}
                            fields={fields}
                            append={append}
                            remove={remove}
                            isDisabled={!!watchAnyDataset}
                        />
                    );
                }

                // Determine options based on the field name
                const getOptions = () => {
                    switch (field.name) {
                        case "type_category":
                            return toolCategoryOptions;
                        case "programming_language":
                            return programmingLanguageOptions;
                        case "keywords":
                            return tagOptions;
                        default:
                            return field.options || [];
                    }
                };

                // Define component props conditionally
                const componentOptionProps =
                    field.component === inputComponents.Autocomplete ||
                    field.component === inputComponents.Select
                        ? {
                              options: getOptions(),
                          }
                        : {};

                return (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        sx={{ mt: 1 }}
                        {...field}
                        {...componentOptionProps}
                    />
                );
            }),
        [
            control,
            fields,
            append,
            remove,
            watchAnyDataset,
            toolCategoryOptions,
            programmingLanguageOptions,
            tagOptions,
        ]
    );

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
                <Form>
                    <Paper>
                        <Box>{hydratedFormFields.map(field => field)}</Box>
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
