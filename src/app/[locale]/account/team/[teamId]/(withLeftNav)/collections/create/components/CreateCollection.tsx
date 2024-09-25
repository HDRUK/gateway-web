"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
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
import UploadFile, { EventUploadedImage } from "@/components/UploadFile";
import AddResourceDialog from "@/modules/AddResourceDialog";
import useActionBar from "@/hooks/useActionBar";
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
    collectionId?: number;
}

const TRANSLATION_PATH_CREATE = "pages.account.team.collections.create";

const CreateCollection = ({ teamId, collectionId }: CollectionCreateProps) => {
    const [fileNotUploaded, setFileNotUploaded] = useState(false);
    const [keywordItem, setKeywordItem] = useState<string[]>([]);

    const t = useTranslations();
    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();
    const textFieldRef = useRef<HTMLInputElement>(null);

    const COLLECTION_ROUTE = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`;
    const FILE_UPLOAD_URL = `${apis.fileUploadV1Url}?entity_flag=collections-media${!!collectionId ? `&collection_id=${collectionId}` : ''}`

    const { handleSubmit, control, setValue, getValues, watch, reset } =
        useForm<Collection>({
            mode: "onTouched",
            resolver: yupResolver(collectionValidationSchema),
            defaultValues: collectionDefaultValues,
        });

    const { data: existingCollectionData } = useGet<Collection>(
        `${apis.collectionsV1Url}/${collectionId}`,
        { shouldFetch: !!collectionId }
    );

    const createCollection = usePost<CollectionSubmission>(
        apis.collectionsV1Url,
        { itemName: "Collection" }
    );
    const editCollection = usePatch<Partial<CollectionSubmission>>(
        apis.collectionsV1Url,
        { itemName: "Collection" }
    );

    useEffect(() => {
        if (!existingCollectionData) {
            return;
        }

        const formData = {
            ...collectionDefaultValues,
            name: existingCollectionData?.name,
            description: existingCollectionData?.description,
            keywords: existingCollectionData?.keywords
                ? setKeywordItem(existingCollectionData?.keywords)
                : [],
            image_link: existingCollectionData?.image_link,
        };

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === ";") {
            event.preventDefault();
            const newkeywordItem = [...keywordItem];
            const newKeyword = textFieldRef?.current?.value;
            const duplicatedValues = newkeywordItem.indexOf(newKeyword?.trim());

            if (duplicatedValues !== -1) {
                setValue("keywords", "");
                return;
            }
            if (!event.target.value.replace(/\s/g, "").length) return;

            newkeywordItem.push(newKeyword.trim());
            setKeywordItem(newkeywordItem);
            setValue("keywords", "");
        }
        if (
            keywordItem.length &&
            !textFieldRef?.current?.value.length &&
            event.code === "Backspace"
        ) {
            setKeywordItem(keywordItem.slice(0, keywordItem.length - 1));
        }
    };

    const handleDelete = item => () => {
        const newkeywordItem = [...keywordItem];
        newkeywordItem.splice(newkeywordItem.indexOf(item), 1);
        setKeywordItem(newkeywordItem);
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
                        {...(field.name === "keywords" && {
                            startAdornment: keywordItem.map(item => (
                                <Chip
                                    key={item}
                                    tabIndex={-1}
                                    label={item}
                                    onDelete={handleDelete(item)}
                                    sx={{ my: 1, mr: 1 }}
                                />
                            )),
                            onKeyDown: event => {
                                handleKeyDown(event);
                            },
                            inputRef: textFieldRef,
                        })}
                    />
                );
            }),
        [control, keywordItem]
    );

    const onSubmit = async (
        formData: Collection,
        status?: DataStatus,
        keywordItem?: string[]
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

            return data?.map(item => item?.id);
        };

        const payload: CollectionSubmission = {
            ...formData,
            status,
            enabled: true,
            public: 1,
            team_id: teamId ? +teamId : undefined,
            keywords: keywordItem,
            image_link: formData.image_link,
            durs: formatEntityToIdArray(formData.dur),
            publications: formatEntityToIdArray(formData.publications),
            tools: formatEntityToIdArray(formData.tools),
            datasets: formatEntityToIdArray(formData.datasets),
        };

        if (!collectionId) {
            await createCollection(payload);
        } else {
            await editCollection(collectionId, payload);
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
                        onSubmit(formData, DataStatus.DRAFT, keywordItem)
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
                    onSubmit(formData, DataStatus.ACTIVE, keywordItem)
                )();
            },
            onCancel: () => {
                push(COLLECTION_ROUTE);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywordItem]);

    const handleFileUploaded = async (fileResponse: FileUpload) => {
        const { file_location } = fileResponse;
        const image_link = `/collections/${file_location}`;

        handleSubmit(formData =>
            onSubmit(
                !collectionId
                    ? {
                          ...formData,
                          image_link,
                      }
                    : {
                          ...formData,
                          ...existingCollectionData,
                          image_link,
                      }
            )
        );
    };

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
                                info={t(
                                    `${TRANSLATION_PATH_CREATE}.addImagesInfo`
                                )}
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
                                    apiPath={FILE_UPLOAD_URL}
                                    onBeforeUploadCheck={(
                                        height: number, width: number
                                    ) => {
                                        const aspectRatio =
                                            (width || 0) /
                                            (height || 0);
                                        return (
                                            aspectRatio <= 2.2 &&
                                            aspectRatio >= 1.8
                                        );
                                    }}
                                    onFileChange={() => {
                                        setFileNotUploaded(false);
                                    }}
                                    onFileCheckSucceeded={(
                                        file: FileUpload
                                    ) => {
                                        handleFileUploaded(file);
                                        setFileNotUploaded(false);
                                    }}
                                    onFileCheckFailed={() => {
                                        setFileNotUploaded(true);
                                    }}
                                    sx={{ py: 2 }}
                                />
                            </FormInputWrapper>

                            {existingCollectionData?.image_link && (
                                <Box sx={{ width: "30%" }}>
                                    <img
                                        src={existingCollectionData?.image_link}
                                        alt={`${existingCollectionData?.name} image`}
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
