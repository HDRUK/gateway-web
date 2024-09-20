"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { Keyword } from "@/interfaces/Keyword";
import { DataUse } from "@/interfaces/DataUse";
import { Publication } from "@/interfaces/Publication";
import { Tool, ToolPayload, ToolPayloadSubmission } from "@/interfaces/Tool";
import { DataSet } from "@/interfaces/DataSet"
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
import UploadImageDialog from "@/modules/UploadImageDialog/UploadImageDialog";
import useActionBar from "@/hooks/useActionBar";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import UploadFile from "@/components/UploadFile";
import {
    collectionDefaultValues,
    collectionFormFields,
    collectionValidationSchema,
} from "@/config/forms/collection";
import { DataStatus } from "@/consts/application";
import { AddIcon, UploadFileIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { Collection, CollectionSubmission } from "@/interfaces/Collection";
import { TextField } from "@mui/material";
import { useSearchParams } from 'next/navigation'

interface CollectionCreateProps {
    teamId?: string;
    userId: number;
    collectionId?: string;
}

const TRANSLATION_PATH = `pages.account.team.collections.create`;

const CreateCollection = ({ teamId, userId, collectionId }: CollectionCreateProps) => {
    const [collectionImage, setCollectionImage] = useState();
    const [isInvalidImage, setIsInvalidImage] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const COLLECTION_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`
    

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<Collection>({
            mode: "onTouched",
            resolver: yupResolver(collectionValidationSchema),
            defaultValues: {
                ...collectionDefaultValues,
            },
        });

    const { data: existingCollectionData } = useGet<Collection>(
        `${apis.collectionsV1Url}/${collectionId}`,
        {
            shouldFetch: !!collectionId,
        }
    );

    const createCollection = usePost<CollectionSubmission>(`${apis.collectionsV1Url}`, {
        itemName: "Collection",
    });

    const editCollection = usePatch<Partial<CollectionSubmission>>(
        `${apis.collectionsV1Url}`,
        {
            itemName: "Collection",
        }
    );

    useEffect(() => {
        if (!existingCollectionData) {
            return;
        }

    //     const propertiesToDelete = [
    //         "programming_languages",
    //         "mongo_object_id",
    //         "team_id",
    //         "collections",
    //         "license",
    //         "status",
    //         "datasets",
    //         "user",
    //         "mongo_id",
    //     ];

    //     // Remove any legacy tool properties
    //     propertiesToDelete.forEach(key => {
    //         if (key in formData) {
    //             delete formData[key as keyof typeof formData];
    //         }
    //     });

        reset(existingCollectionData as Collection);
    }, [reset, existingCollectionData]);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "dataset",
    });

    const watchAll = watch();

    const onSubmit = async (formData: Collection, status: DataStatus) => {
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ updated_at, created_at, ...item }) => item
        );

        const payload: CollectionSubmission = {
            ...formData,
            user_id: userId,
            team_id: teamId ? +teamId : undefined,
            enabled: true,
            tag: formData.keywords,
            status,
            durs: formatEntityToIdArray(formData.durs),
            publications,
            tools: formatEntityToIdArray(formData.tools),
        };

        if (!collectionId) {
            await createCollection(payload);
        } else {
            await editCollection(collectionId, payload);
        }

        push(COLLECTION_ROUTE);
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue("datasets", selectedResources[ResourceType.DATASET]);
                setValue("durs", selectedResources[ResourceType.DATA_USE]);
                setValue(
                    "publications",
                    selectedResources[ResourceType.PUBLICATION]
                );
                setValue("tools", selectedResources[ResourceType.TOOL]);

            },
            defaultResources: {
                dataset: getValues("datasets"),
                datause: getValues("durs"),
                publication: getValues("publications"),
                tool: getValues("tools")
            },
        });
    };

  
    const selectedResources = useMemo(() => {
        return {
            datause: (getValues("durs") as DataUse[]) || [],
            publication: (getValues("publications") as Publication[]) || [],
            tool: (getValues("tools") as Tool[]) || [],
            dataset: (getValues("datasets") as DataSet[]) || [],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchAll, getValues]);

    useEffect(() => {
        showBar("CreateCollection", {
            cancelText: t("cancel"),
            confirmText: t("makeActive"),
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
                push(COLLECTION_ROUTE);
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
        } else if (resourceType === ResourceType.DATA_SET) {
            setValue("datasets", updatedResources as DataSet[]);
        }
    };
    
    const handleInvalidImage = (isNotValid: boolean) => {
        setIsInvalidImage(isNotValid);
    };

    useEffect(() => {
        if(isInvalidImage) {
            showDialog(UploadImageDialog, { setIsInvalidImage: handleInvalidImage })
        }
    },[isInvalidImage]);

    const hydratedFormFields = useMemo(
        () =>
            collectionFormFields.map(field => {
                return (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        sx={{ mt: 1 }}
                        {...field}
                    />
                );
            })
            ,
        [
            control,
            fields,
            append,
            remove
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
                        {/*UPLOAD IMAGE*/}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                            <Typography variant="h2">
                                {t("addImages")}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                            {!!searchParams?.get('upload') ? t("addImageSuccess") : t("addImagesInfo")}
                            </Typography>
                            </Box>
                            <Box sx={{ display: "flex", textAlign: "center", justifyContent: "space-between", pr: 0, alignItems: "center" }}>
                                <UploadFile
                                    sx={{ml: 20}}
                                    apiPath={`${apis.fileUploadV1Url}?entity_flag=collections-media&collection_id=80`}
                                    fileUploadedAction={(fileId: number) =>
                                        setCreatedDurId(fileId)
                                    }
                                    isUploading={setIsUploading}
                                    helperText={false}
                                    label="uploadImage"
                                    acceptedFileTypes=".png"
                                    setIsInvalidImage={handleInvalidImage}
                                 />
                            </Box>
                        </Box>
                    </Paper>
                    {/* ADD RESOURCES */}
                    <Paper sx={{ mt: 1, mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                            <Typography variant="h2">
                                {t("addResources")}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                {t("addResourcesInfo")}
                            </Typography>
                            </Box>
                            <Box sx={{ display: "flex", pr: 0, alignItems: "center" }}>
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

export default CreateCollection;
