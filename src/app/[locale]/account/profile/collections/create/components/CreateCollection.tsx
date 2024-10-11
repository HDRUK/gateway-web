"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { Collection, CollectionSubmission } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { FileUpload } from "@/interfaces/FileUpload";
import { Keyword } from "@/interfaces/Keyword";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
import { OptionsType, ValueType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import FormInputWrapper from "@/components/FormInputWrapper";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import ResourceTable from "@/components/ResourceTable";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import AddResourceDialog from "@/modules/AddResourceDialog";
import useActionBar from "@/hooks/useActionBar";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    collectionDefaultValues,
    collectionFormFields,
    collectionValidationSchema,
} from "@/config/forms/collection";
import { DataStatus } from "@/consts/application";
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

interface CollectionCreateProps {
    collectionId?: string;
    userId?: string;
}

const TRANSLATION_PATH_CREATE = "pages.account.profile.collections.create";

const CreateCollection = ({ collectionId, userId }: CollectionCreateProps) => {
    const [fileNotUploaded, setFileNotUploaded] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [file, setFile] = useState<File>();
    const [createdCollectionId, setCreatedCollectionId] = useState<
        string | undefined
    >(collectionId);
    const [fileToBeUploaded, setFileToBeUploaded] = useState<boolean>();

    const t = useTranslations();
    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();

    const COLLECTION_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COLLECTIONS}`;

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<Collection>({
            mode: "onTouched",
            resolver: yupResolver(collectionValidationSchema),
            defaultValues: {
                ...collectionDefaultValues,
            },
        });

    const { data: keywordData } = useGet<Keyword[]>(
        `${apis.keywordsV1Url}?per_page=-1`
    );

    const { data: existingCollectionData } = useGet<Collection>(
        `${apis.collectionsV1Url}/${collectionId}`,
        { shouldFetch: !!collectionId }
    );
    const createCollection = usePost<CollectionSubmission>(
        apis.collectionsV1Url,
        { itemName: "Collection", successNotificationsOn: !file }
    );
    const editCollection = usePatch<Partial<CollectionSubmission>>(
        apis.collectionsV1Url,
        { itemName: "Collection" }
    );

    const keywordOptions = useMemo(() => {
        if (!keywordData) return [];

        return keywordData.map(data => {
            return {
                value: data.id as ValueType,
                label: data.name,
            };
        }) as OptionsType[];
    }, [keywordData]);

    useEffect(() => {
        if (!existingCollectionData) {
            return;
        }

        const formData = {
            ...existingCollectionData,
            name: existingCollectionData?.name,
            description: existingCollectionData?.description,
            keywords:
                existingCollectionData?.keywords?.map(item => item.id) || [],
            image_link: existingCollectionData?.image_link,
        };
        if (formData.image_link) {
            setImageUploaded(true);
        }
        const propertiesToDelete = ["mongo_object_id", "mongo_id"];
        propertiesToDelete.forEach(key => {
            if (key in formData) {
                delete formData[key as keyof typeof formData];
            }
        });

        reset(formData);
    }, [reset, existingCollectionData]);
    const watchAll = watch();
    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue(
                    "dur",
                    selectedResources[ResourceType.DATA_USE] as DataUse[]
                );
                setValue(
                    "datasets",
                    selectedResources[ResourceType.DATASET] as Dataset[]
                );
                setValue(
                    "publications",
                    selectedResources[ResourceType.PUBLICATION] as Publication[]
                );
                setValue(
                    "tools",
                    selectedResources[ResourceType.TOOL] as Tool[]
                );
            },
            defaultResources: {
                datause: getValues("dur"),
                dataset: getValues("datasets"),
                publication: getValues("publications"),
                tool: getValues("tools"),
            },
        });
    };
    const selectedResources = useMemo(() => {
        return {
            datause: (getValues("dur") as DataUse[]) || [],
            publication: (getValues("publications") as Publication[]) || [],
            tool: (getValues("tools") as Tool[]) || [],
            dataset: (getValues("datasets") as Dataset[]) || [],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchAll, getValues]);
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
            setValue("dur", updatedResources as DataUse[]);
        } else if (resourceType === ResourceType.PUBLICATION) {
            setValue("publications", updatedResources as Publication[]);
        } else if (resourceType === ResourceType.TOOL) {
            setValue("tools", updatedResources as Tool[]);
        } else if (resourceType === ResourceType.DATASET) {
            setValue("datasets", updatedResources as Dataset[]);
        }
    };
    const hydratedFormFields = useMemo(
        () =>
            collectionFormFields.map(field => {
                return (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        sx={{ mt: 1 }}
                        {...field}
                        {...(field.component === inputComponents.Autocomplete
                            ? {
                                  options: keywordOptions,
                              }
                            : {})}
                    />
                );
            }),
        [control, keywordOptions]
    );
    const onSubmit = async (
        formData: Collection,
        status?: DataStatus,
        file?: File
    ) => {
        const formatEntityToIdArray = (
            data: DataUse[] | Publication[] | Tool[] | Dataset[]
        ) => {
            if (
                Array.isArray(data) &&
                data.every(item => typeof item === "number")
            ) {
                return data;
            }
            return data?.map(item => ({ id: item?.id }));
        };
        const formatKeywords = (data: string[] | string) => {
            const keywordArray: string[] = [];
            if (Array.isArray(data)) {
                keywordOptions?.forEach(x => {
                    data.forEach(y => {
                        const number = Number(y);
                        if (number === x.value) {
                            keywordArray.push(x.label);
                        }
                    });
                });
            }
            return keywordArray;
        };

        const publications = formData.publications.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ updated_at, created_at, ...item }) => item
        );
        const payload: CollectionSubmission = {
            ...formData,
            status,
            enabled: true,
            public: 1,
            team_id: undefined,
            user_id: userId,
            keywords: formatKeywords(formData.keywords),
            image_link: formData.image_link,
            dur: formatEntityToIdArray(formData.dur),
            publications,
            tools: formatEntityToIdArray(formData.tools),
            datasets: formatEntityToIdArray(formData.datasets),
            created_at: formData.created_at?.split(".")[0],
            updated_at: formData.updated_at?.split(".")[0],
            updated_on: formData.updated_on?.split(".")[0],
        };
        if (!collectionId) {
            await createCollection(payload).then(async result => {
                if (typeof result === "number" && file) {
                    setCreatedCollectionId(result as string);
                    setFileToBeUploaded(true);
                }
            });
        } else {
            await editCollection(collectionId, payload).then(async () => {
                if (file) {
                    setFileToBeUploaded(true);
                }
            });
        }

        push(COLLECTION_ROUTE);
    };
    useEffect(() => {
        showBar("CreateCollection", {
            cancelText: t(`${TRANSLATION_PATH_CREATE}.cancel`),
            confirmText: t(`${TRANSLATION_PATH_CREATE}.publish`),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(formData =>
                        onSubmit(formData, DataStatus.DRAFT, file)
                    )();
                },
                buttonText: t(`${TRANSLATION_PATH_CREATE}.saveDraft`),
                buttonProps: {
                    color: "secondary",
                    variant: "outlined",
                },
            },
            onSuccess: () => {
                handleSubmit(formData =>
                    onSubmit(formData, DataStatus.ACTIVE, file)
                )();
            },
            onCancel: () => {
                push(COLLECTION_ROUTE);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    const uploadFile = usePost(
        `${apis.fileUploadV1Url}?entity_flag=collections-media&collection_id=${createdCollectionId}`,
        {
            successNotificationsOn: false,
        }
    );

    useEffect(() => {
        const handleFileUploaded = async (
            createdCollectionId: string,
            file: File
        ) => {
            const formData = new FormData();
            formData.append("file", file);

            const uploadedFileStatus = (await uploadFile(formData).catch(() =>
                setFile(undefined)
            )) as FileUpload;

            const { file_location } = uploadedFileStatus;

            await editCollection(createdCollectionId, {
                image_link: file_location,
            });
        };

        if (file && fileToBeUploaded && createdCollectionId) {
            handleFileUploaded(createdCollectionId, file);
        }
    }, [
        createdCollectionId,
        fileToBeUploaded,
        editCollection,
        file,
        uploadFile,
    ]);

    return (
        <>
            <BoxContainer
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="h2">
                        {t(`${TRANSLATION_PATH_CREATE}.title`)}
                    </Typography>
                    <Typography>
                        {t(`${TRANSLATION_PATH_CREATE}.intro`)}
                    </Typography>
                </Box>
                <Box>
                    <Chip
                        resourceType={ResourceType.TOOL}
                        label={t(`${TRANSLATION_PATH_CREATE}.labelTag`)}
                    />
                </Box>
            </BoxContainer>
            <BoxContainer>
                <Form>
                    <Paper>
                        <Box>{hydratedFormFields.map(field => field)}</Box>
                        {/* UPLOAD IMAGE */}
                        <Box
                            sx={{
                                display: "flex",
                                p: 2,
                                gap: 4,
                            }}>
                            <FormInputWrapper
                                label={t(
                                    `${TRANSLATION_PATH_CREATE}.addImages`
                                )}
                                info={
                                    imageUploaded
                                        ? t(
                                              `${TRANSLATION_PATH_CREATE}.addImageSuccess`
                                          )
                                        : t(
                                              `${TRANSLATION_PATH_CREATE}.addImagesInfo`
                                          )
                                }
                                error={
                                    fileNotUploaded
                                        ? {
                                              type: "",
                                              message: t(
                                                  `${TRANSLATION_PATH_CREATE}.aspectRatioError`
                                              ),
                                          }
                                        : undefined
                                }
                                formControlSx={{ width: "70%", p: 0 }}>
                                <UploadFile
                                    fileSelectButtonText={t(
                                        `${TRANSLATION_PATH_CREATE}.fileSelectButtonText`
                                    )}
                                    acceptedFileTypes=".jpg,.png"
                                    onBeforeUploadCheck={(
                                        height: number,
                                        width: number
                                    ) => {
                                        const aspectRatio =
                                            (width || 0) / (height || 0);
                                        return (
                                            aspectRatio <= 2.5 &&
                                            aspectRatio >= 1.5
                                        );
                                    }}
                                    onFileChange={(file: File) => {
                                        setFileNotUploaded(false);
                                        setFile(file);
                                    }}
                                    onFileCheckSucceeded={() => {
                                        setFileNotUploaded(false);
                                        setImageUploaded(true);
                                    }}
                                    onFileCheckFailed={() => {
                                        setFileNotUploaded(true);
                                    }}
                                    sx={{ py: 2 }}
                                    showUploadButton={false}
                                />
                            </FormInputWrapper>

                            {existingCollectionData?.image_link && (
                                <Box sx={{ width: "30%" }}>
                                    <img
                                        src={existingCollectionData?.image_link}
                                        alt={`${existingCollectionData?.name} logo`}
                                        width="100%"
                                    />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                    {/* ADD RESOURCES */}
                    <Paper sx={{ mt: 1, mb: 2 }}>
                        <Box>
                            <Typography variant="h2">
                                {t(`${TRANSLATION_PATH_CREATE}.addResources`)}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                {t(
                                    `${TRANSLATION_PATH_CREATE}.addResourcesInfo`
                                )}
                            </Typography>
                            <Divider />
                            <Box sx={{ textAlign: "center", mt: 1 }}>
                                <Button
                                    onClick={handleAddResource}
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<AddIcon />}>
                                    {t(
                                        `${TRANSLATION_PATH_CREATE}.addResourceButton`
                                    )}
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
