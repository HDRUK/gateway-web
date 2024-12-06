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
import { Dataset, ReducedDataset, VersionItem } from "@/interfaces/Dataset";
import { FileUpload } from "@/interfaces/FileUpload";
import { Keyword } from "@/interfaces/Keyword";
import { Option } from "@/interfaces/Option";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
import { User } from "@/interfaces/User";
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
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import {
    collectionDefaultValues,
    collectionFormFields,
    collectionValidationSchema,
} from "@/config/forms/collection";
import { DataStatus } from "@/consts/application";
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

interface CollectionCreateProps {
    teamId?: string;
    userId?: string;
    collectionId?: string;
}

const TRANSLATION_PATH_CREATE = "pages.account.team.collections.create";

const CollectionForm = ({
    teamId,
    userId,
    collectionId,
}: CollectionCreateProps) => {
    const [fileNotUploaded, setFileNotUploaded] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [file, setFile] = useState<File>();
    const [createdCollectionId, setCreatedCollectionId] = useState<
        string | undefined
    >(collectionId);
    const [fileToBeUploaded, setFileToBeUploaded] = useState<boolean>();

    const t = useTranslations();
    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();
    const searchNameDebounced = useDebounce(searchName, 500);

    const COLLECTION_ROUTE = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COLLECTIONS}`;

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<Collection>({
            mode: "onTouched",
            resolver: yupResolver(collectionValidationSchema),
            defaultValues: {
                ...collectionDefaultValues,
            },
        });

    const { data: keywordData } = useGet<Keyword[]>(
        `${apis.keywordsV1Url}?perPage=-1`
    );

    const { data: userData = [], isLoading: isLoadingUsers } = useGet<User[]>(
        `${apis.usersV1Url}?filterNames=${searchNameDebounced}`,
        {
            shouldFetch: !!searchNameDebounced && !teamId,
        }
    );

    const { data: existingCollectionData } = useGet<Collection>(
        `${apis.collectionsV1Url}/${collectionId}?view_type=mini`,
        { shouldFetch: !!collectionId }
    );

    const createCollection = usePost<CollectionSubmission>(
        teamId
            ? `${apis.teamsV1Url}/${teamId}/collections`
            : apis.collectionsV2Url,
        { itemName: "Collection", successNotificationsOn: !file }
    );

    const editCollection = usePatch<Partial<CollectionSubmission>>(
        teamId
            ? `${apis.teamsV1Url}/${teamId}/collections`
            : apis.collectionsV2Url,
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

    const updateUserOptions = (
        prevOptions: Option[],
        userOptions: Option[]
    ) => {
        const existingUserIds = prevOptions.map(option => option.value);
        const newOptions = userOptions?.filter(
            option => !existingUserIds.includes(option.value)
        );
        if (newOptions && newOptions.length > 0) {
            return [...prevOptions, ...newOptions].sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }
        return prevOptions;
    };

    useEffect(() => {
        const userOptions = userData.map(user => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        }));

        setUserOptions(prevOptions =>
            updateUserOptions(prevOptions, userOptions)
        );
    }, [userData]);

    useEffect(() => {
        if (!existingCollectionData) {
            return;
        }

        const datasetVersionToDataset = (datasetVersions: VersionItem[]) => {
            // this function is a temporary hack and this all needs sorting out
            // GET collections returns `dataset_versions` in a particular format
            // but POST collections is expecting datasets
            if (!datasetVersions) return [];

            const tempDatasets = datasetVersions.map(dv => {
                return {
                    id: dv.dataset_id,
                    latest_metadata: { metadata: dv.metadata },
                    shortTitle: dv.shortTitle,
                    dataCustodian: dv.dataCustodian,
                };
            });
            return tempDatasets;
        };

        const collaborators =
            existingCollectionData?.users
                ?.filter(item => item.pivot.role !== "CREATOR")
                .map(item => {
                    return item.id;
                }) || [];

        const formData = {
            ...existingCollectionData,
            datasets: datasetVersionToDataset(
                existingCollectionData.dataset_versions
            ),
            name: existingCollectionData?.name,
            description: existingCollectionData?.description,
            keywords:
                existingCollectionData?.keywords?.map(item => item.id) || [],
            image_link: existingCollectionData?.image_link,
            collaborators,
        };

        if (collaborators) {
            const labels = existingCollectionData?.users
                ?.filter(item => item.pivot.role !== "CREATOR")
                .map(item => {
                    return {
                        label: `${item.name} (${item.email})`,
                        value: item.id,
                    };
                });
            setUserOptions(labels);
        }

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

    const datasetToDatasetVersion = (datasets: ReducedDataset[]) => {
        if (!datasets) return [];

        const tempDatasetVersions = datasets.map(d => {
            return {
                id: d.version_id,
                dataset_id: d.id,
                shortTitle: d.shortTitle,
            };
        });
        return tempDatasetVersions;
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue(
                    "dur",
                    selectedResources[ResourceType.DATA_USE] as DataUse[]
                );
                setValue(
                    "datasets",
                    selectedResources[ResourceType.DATASET] as ReducedDataset[]
                );
                // setValue("dataset_versions", datasetToDatasetVersion(selectedResources[ResourceType.DATASET]) as VersionItem[]);
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

    const datasetVersionToDataset = (datasetVersions: VersionItem[]) => {
        // this function is a temporary hack and this all needs sorting out
        // GET collections returns `dataset_versions` in a particular format
        // but POST collections is expecting datasets
        if (!datasetVersions) return [];

        const tempDatasets = datasetVersions.map(dv => {
            return {
                id: dv.dataset_id,
                version_id: dv.id,
                shortTitle: dv.shortTitle,
            };
        });
        return tempDatasets;
    };



    const selectedResources = useMemo(() => {
        console.log('memo', getValues("datasets"));
        return {
            datause: (getValues("dur") as DataUse[]) || [],
            publication: (getValues("publications") as Publication[]) || [],
            tool: (getValues("tools") as Tool[]) || [],
            dataset: (getValues("datasets") as ReducedDataset[]) || [],
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
            // convert dataset ids to dataset_version_ids
            // const dataset_id = 
            // set 
            // console.log('removed', updatedResources,  datasetToDatasetVersion(updatedResources));
            setValue("datasets", updatedResources as ReducedDataset[]);
            // setValue("dataset_versions", datasetToDatasetVersion(updatedResources) as ReducedDataset[]);
            // console.log('getValues("dataset_versions")', getValues("dataset_versions"));
            // console.log('getValues("datasets")', getValues("datasets"));
        }
    };

    const getOptions = (field: string) => {
        if (field === "keywords") {
            return keywordOptions;
        }
        return userOptions;
    };

    const handleOnUserInputChange = (e: React.ChangeEvent, value: string) => {
        if (value === "") {
            setSearchName(value);
            return;
        }
        if (e?.type !== "change") {
            return;
        }
        setSearchName(value);
    };

    const hydratedFormFields = useMemo(
        () =>
            collectionFormFields.map(field => {
                const fieldName = field.name;
                if (!teamId || fieldName !== "collaborators") {
                    return (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            sx={{ mt: 1 }}
                            {...field}
                            {...(field.name === "collaborators" ||
                            field.name === "keywords"
                                ? {
                                      options: getOptions(fieldName),
                                      onInputChange: handleOnUserInputChange,
                                      isLoadingOptions:
                                          fieldName === "collaborators" &&
                                          isLoadingUsers,
                                  }
                                : {})}
                        />
                    );
                }
                return null;
            }),
        [control, keywordOptions, userOptions, isLoadingUsers]
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

        const payload: CollectionSubmission = {
            ...formData,
            status,
            enabled: true,
            public: 1,
            team_id: teamId ? +teamId : undefined,
            user_id: !teamId ? userId : undefined,
            keywords: formatKeywords(formData.keywords),
            image_link: formData.image_link,
            dur: formatEntityToIdArray(formData.dur),
            publications: formatEntityToIdArray(formData.publications),
            tools: formatEntityToIdArray(formData.tools),
            datasets: formatEntityToIdArray(formData.datasets),
            collaborators: formData.collaborators,
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

export default CollectionForm;
