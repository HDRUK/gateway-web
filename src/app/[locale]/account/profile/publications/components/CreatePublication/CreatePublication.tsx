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
import {
    PublicationPayload,
    PublicationPayloadSubmission,
} from "@/interfaces/Publication";
import { Tool, ToolPayload } from "@/interfaces/Tool";
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
import config from "@/config/config";
import {
    defaultDatasetValue,
    publicationDefaultValues,
    publicationFormFields,
    publicationValidationSchema,
} from "@/config/forms/publication";
import { DataStatus } from "@/consts/application";
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import DatasetRelationshipFields from "../DatasetRelationshipFields";

interface CreatePublicationProps {
    teamId?: string;
    userId: number;
    publicationId?: string;
}

const TRANSLATION_PATH = "pages.account.profile.publications.create";

const CreatePublication = ({
    teamId,
    userId,
    publicationId,
}: CreatePublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const storedData = localStorage.getItem(config.PUBLICATION_LOCAL_STORAGE);
    // console.log(JSON.parse(storedData));

    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();

    const PUBLICATIONS_ROUTE = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}`;

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<PublicationPayload>({
            mode: "onTouched",
            resolver: yupResolver(publicationValidationSchema),
            defaultValues: {
                ...publicationDefaultValues,
            },
        });

    const { data: toolCategoryData } = useGet<Category[]>(
        `${apis.toolCategoriesV1Url}?perPage=200`
    );

    const { data: programmingLanguageData } = useGet<Category[]>(
        `${apis.programmingLanguagesV1Url}?perPage=200`
    );

    const { data: existingPublicationData } = useGet<Tool>(
        `${apis.publicationsV1Url}/${publicationId}`,
        {
            shouldFetch: !!publicationId,
        }
    );

    const createPublication = usePost<PublicationPayloadSubmission>(
        `${apis.publicationsV1Url}`,
        {
            itemName: "Tool",
        }
    );

    const editPublication = usePatch<Partial<PublicationPayloadSubmission>>(
        `${apis.publicationsV1Url}`,
        {
            itemName: "Tool",
        }
    );

    useEffect(() => {
        if (!existingPublicationData) {
            return;
        }

        const formData = {
            ...existingPublicationData,
            dataset: defaultDatasetValue,
        };

        const propertiesToDelete = ["publication_type_mk1", "mongo_id"];

        // // Remove any legacy tool properties
        propertiesToDelete.forEach(key => {
            if (key in formData) {
                delete formData[key as keyof typeof formData];
            }
        });

        reset(formData as ToolPayload);
    }, [reset, existingPublicationData]);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "dataset",
    });

    const watchAll = watch();

    const onSubmit = async (
        formData: PublicationPayload,
        status: DataStatus
    ) => {
        const formatEntityToIdArray = (data: Tool[]) => {
            if (
                Array.isArray(data) &&
                data.every(item => typeof item === "number")
            ) {
                return data;
            }

            return data?.map(item => ({ id: item?.id }));
        };

        const payload: PublicationPayloadSubmission = {
            ...formData,
            status,
            tools: formatEntityToIdArray(formData.tools),
            dataset: formData.dataset.every(
                (obj: {}) => Object.keys(obj).length === 0
            )
                ? []
                : formData.dataset,

            paper_doi: formData.url,
        };

        console.log(payload);

        if (!publicationId) {
            await createPublication(payload);
        } else {
            await editPublication(publicationId, payload);
        }

        // push(PUBLICATIONS_ROUTE);
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue(
                    "tools",
                    selectedResources[ResourceType.TOOL] as Tool[]
                );
            },
            hideDatasets: true,
            defaultResources: {
                tool: getValues("tools"),
            },
        });
    };

    const selectedResources = useMemo(() => {
        return {
            tool: (getValues("tools") as Tool[]) || [],
        };
    }, [watchAll]);

    useEffect(() => {
        showBar("CreatePublication", {
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
                push(PUBLICATIONS_ROUTE);
            },
        });
    }, []);

    const handleRemoveResource = (
        data: ResourceDataType,
        resourceType: ResourceType
    ) => {
        const currentResource = selectedResources[resourceType];

        // Add or remove the resource based on isSelected
        const updatedResources = currentResource.filter(
            (resource: { id: number }) => resource.id !== data.id
        );

        // Update the state with the new list of selected resources
        if (resourceType === ResourceType.TOOL) {
            setValue("tools", updatedResources as Tool[]);
        }
    };

    const hydratedFormFields = useMemo(
        () =>
            publicationFormFields.map(field => {
                if (field.label === "DATASET_RELATIONSHIP_COMPONENT") {
                    return (
                        <DatasetRelationshipFields
                            key={field.label}
                            control={control}
                            fields={fields}
                            append={append}
                            remove={remove}
                        />
                    );
                }

                return (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        sx={{ mt: 1 }}
                        {...field}
                    />
                );
            }),
        [fields]
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
                        resourceType={ResourceType.PUBLICATION}
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

export default CreatePublication;
