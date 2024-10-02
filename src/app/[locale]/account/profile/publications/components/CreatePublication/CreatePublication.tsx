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
import { DataUse } from "@/interfaces/DataUse";
import {
    EuropePMCPublication,
    PublicationPayload,
    PublicationPayloadSubmission,
} from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
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
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
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
    publicationId?: string;
}

const TRANSLATION_PATH = "pages.account.profile.publications.create";

const CreatePublication = ({
    teamId,
    publicationId,
}: CreatePublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);

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

    const { data: existingPublicationData } = useGet<PublicationPayload>(
        `${apis.publicationsV1Url}/${publicationId}`,
        {
            shouldFetch: !!publicationId,
        }
    );

    const createPublication = usePost<PublicationPayloadSubmission>(
        `${apis.publicationsV1Url}`,
        {
            itemName: "Publication",
        }
    );

    const editPublication = usePut<Partial<PublicationPayloadSubmission>>(
        `${apis.publicationsV1Url}`,
        {
            itemName: "Publication",
        }
    );

    useEffect(() => {
        if (!existingPublicationData) {
            const storedPmcData = localStorage.getItem(
                config.PUBLICATION_LOCAL_STORAGE
            );

            if (!storedPmcData) {
                return;
            }

            const data: EuropePMCPublication =
                storedPmcData && JSON.parse(storedPmcData);

            // Clear localstorage
            localStorage.removeItem(config.PUBLICATION_LOCAL_STORAGE);

            // Populate from EuropePMC
            const formData = {
                ...publicationDefaultValues,
                datasets: defaultDatasetValue,
                journal_name: data?.journal_name,
                paper_title: data?.title,
                authors: data?.authors,
                abstract: data?.abstract,
                publication_type: data?.is_preprint
                    ? "Preprints"
                    : "Research articles",
                year_of_publication: data?.publication_year,
                paper_doi: data?.doi,
                is_preprint: data?.is_preprint,
            };

            reset(formData as unknown as PublicationPayload);
            return;
        }

        const formData = {
            ...existingPublicationData,
        };

        const propertiesToDelete = ["publication_type_mk1", "mongo_id"];

        // Remove any legacy properties
        propertiesToDelete.forEach(key => {
            if (key in formData) {
                delete formData[key as keyof typeof formData];
            }
        });

        reset(formData as PublicationPayload);
    }, [reset, existingPublicationData]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "datasets",
    });

    const watchAll = watch();

    const onSubmit = async (
        formData: PublicationPayload,
        status: DataStatus
    ) => {
        const formatEntityToIdArray = (data: Tool[] | DataUse[]) => {
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
            durs: formatEntityToIdArray(formData.durs),
            ...(teamId && { team_id: teamId }),
            datasets: formData.datasets.every(
                (obj: object) => Object.keys(obj).length === 0
            )
                ? []
                : formData.datasets,
        };

        if (!publicationId) {
            await createPublication(payload);
        } else {
            await editPublication(publicationId, payload);
        }

        push(PUBLICATIONS_ROUTE);
    };

    const handleAddResource = () => {
        showDialog(AddResourceDialog, {
            setResources: (selectedResources: SelectedResources) => {
                setValue(
                    "tools",
                    selectedResources[ResourceType.TOOL] as Tool[]
                );
                setValue(
                    "durs",
                    selectedResources[ResourceType.DATA_USE] as DataUse[]
                );
            },
            defaultResources: {
                tool: getValues("tools"),
                datause: getValues("durs"),
            },
        });
    };

    const selectedResources = useMemo(() => {
        return {
            tool: (getValues("tools") as Tool[]) || [],
            datause: (getValues("durs") as DataUse[]) || [],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (resourceType === ResourceType.DATA_USE) {
            setValue("durs", updatedResources as DataUse[]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
