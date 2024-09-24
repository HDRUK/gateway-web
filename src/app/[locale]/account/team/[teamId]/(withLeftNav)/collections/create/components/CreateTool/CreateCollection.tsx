"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    ResourceDataType,
    ResourceType,
    SelectedResources,
} from "@/interfaces/AddResource";
import { DataUse } from "@/interfaces/DataUse";
import { Publication } from "@/interfaces/Publication";
import { Divider } from "@mui/material";
import { Tool } from "@/interfaces/Tool";
import { DataSet } from "@/interfaces/DataSet"
import { Keyword } from "@/interfaces/Keyword";
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
import { AddIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { Collection, CollectionSubmission } from "@/interfaces/Collection";
import { useSearchParams } from 'next/navigation'

interface CollectionCreateProps {
    teamId?: string;
    userId: number;
    collectionId?: number;
}

const TRANSLATION_PATH = `pages.account.team.collections.create`;

const CreateCollection = ({ teamId, collectionId }: CollectionCreateProps) => {
    const [isInvalidImage, setIsInvalidImage] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [keywordItem, setkeywordItem] = useState([]);
    const [createdCollectionId, setCreatedCollectionId]

    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();
    const { showBar } = useActionBar();
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const textFieldRef = useRef();

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

        const formData = {
            ...collectionDefaultValues,
            name: existingCollectionData?.name,
            description: existingCollectionData?.description,
            keywords: existingCollectionData?.keywords
                ? setkeywordItem(existingCollectionData?.keywords)
                : [],
            image_link: existingCollectionData?.image_link,
        }

        const propertiesToDelete = [
            "mongo_object_id",
            "mongo_id",
        ];

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
                setValue("datasets", selectedResources[ResourceType.DATASET] as DataSet[]);
                setValue("durs", selectedResources[ResourceType.DATA_USE] as DataUse[]);
                setValue(
                    "publications",
                    selectedResources[ResourceType.PUBLICATION] as Publication[]
                );
                setValue("tools", selectedResources[ResourceType.TOOL] as Tool[]);

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
    }, [watchAll]);

   
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ";") {
          event.preventDefault();
          const newkeywordItem = [...keywordItem];
          const newKeyword = textFieldRef?.current?.value;
          const duplicatedValues = newkeywordItem.indexOf(
            newKeyword.trim()
          );
    
          if (duplicatedValues !== -1) {
            setValue("keywords", "")
            return;
          }
          if (!event.target.value.replace(/\s/g, "").length) return;
    
          newkeywordItem.push(newKeyword.trim());
          setkeywordItem(newkeywordItem);
          setValue("keywords", "")
        }
        if (
          keywordItem.length &&
          !textFieldRef?.current?.value.length &&
          event.code === "Backspace"
        ) {
          setkeywordItem(keywordItem.slice(0, keywordItem.length - 1));
        }
      }

    const handleDelete = item => () => {
        const newkeywordItem = [...keywordItem];
        newkeywordItem.splice(newkeywordItem.indexOf(item), 1);
        setkeywordItem(newkeywordItem);
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
                        {...(field.name ===
                            "keywords" && {
                            startAdornment: keywordItem.map(item => (
                                <Chip
                                    key={item}
                                    tabIndex={-1}
                                    label={item}
                                    onDelete={handleDelete(item)}
                                    sx={{my: 1, mr: 1}}
                                />
                                )),
                            onKeyDown: event => {
                                handleKeyDown(event)
                            },
                            inputRef: textFieldRef,
                        })}
                    />
                );
            })
            ,
        [control,keywordItem]
    );

    useEffect(() => {
        showBar("CreateCollection", {
            cancelText: t("cancel"),
            confirmText: t("publish"),
            tertiaryButton: {
                onAction: async () => {
                    handleSubmit(formData =>
                        onSubmit(formData, DataStatus.DRAFT, keywordItem)
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
                    onSubmit(formData, DataStatus.ACTIVE, keywordItem)
                )();
            },
            onCancel: () => {
                push(COLLECTION_ROUTE);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywordItem]);

    const onSubmit = async (formData: Collection, status: DataStatus, keywordItem: string[]) => {
        const formatEntityToIdArray = (
            data: DataUse[] | Publication[] | Tool[] | DataSet[]
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
                                    apiPath={`${apis.fileUploadV1Url}?entity_flag=collections-media&collection_id=${collectionId}`}
                                    isUploading={setIsUploading}
                                    fileUploadedAction={fileId =>
                                        setCreatedCollectionId(fileId as number)
                                    }
                                    helperText={false}
                                    label="uploadImage"
                                    acceptedFileTypes=".png .jpeg"
                                    setIsInvalidImage={handleInvalidImage}
                                 />
                            </Box>
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

export default CreateCollection;
