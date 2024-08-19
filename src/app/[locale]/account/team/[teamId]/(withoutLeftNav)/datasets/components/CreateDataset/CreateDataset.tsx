"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { get, omit } from "lodash";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { buildYup } from "schema-to-yup";
import { AuthUser } from "@/interfaces/AuthUser";
import {
    CreateOrigin,
    Dataset,
    DatasetStatus,
    Metadata,
    NewDataset,
    StructuralMetadata,
} from "@/interfaces/Dataset";
import {
    FormHydration,
    FormHydrationSchema,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem } from "@/interfaces/FormLegend";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormBanner, { NAVBAR_ID } from "@/components/FormBanner/FormBanner";
import FormLegend from "@/components/FormLegend";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import {
    mapExistingDatasetToFormFields,
    formGenerateLegendItems,
    formGetFieldsCompletedCount,
    formatValidationItems,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    isFirstSection,
    isLastSection,
    mapFormFieldsForSubmission,
    renderFormHydrationField,
} from "@/utils/formHydration";
import { capitalise, splitCamelcase } from "@/utils/general";
import IntroScreen from "../IntroScreen";
import StructuralMetadataSection from "../StructuralMetadata";
import SubmissionScreen from "../SubmissionScreen";
import { FormFooter, FormFooterItem } from "./CreateDataset.styles";
import FormFieldArray from "./FormFieldArray";

interface CreateDatasetProps {
    formJSON: FormHydrationSchema;
    teamId: number;
    user: AuthUser;
}

const INITIAL_FORM_SECTION = "Home";
const SUBMISSON_FORM_SECTION = "Submission";
const STRUCTURAL_METADATA_FORM_SECTION = "Structural metadata";
const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "3.0.0";

const getMetadata = (isDraft: boolean) =>
    isDraft
        ? "versions[0].metadata.original_metadata"
        : "versions[0].metadata.metadata";

const today = dayjs();

const CreateDataset = ({ formJSON, teamId, user }: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const params = useParams<{
        teamId: string;
        datasetId: string;
    }>();

    const searchParams = useSearchParams();

    const [isDraft, setIsDraft] = useState<boolean>(
        searchParams?.get("status") === DataStatus.DRAFT
    );

    const isDuplicate = searchParams?.get("duplicate");

    const [draftToggled, setDraftToggled] = useState<boolean>();

    const isEditing = params?.datasetId;

    const [datasetId, setDatasetId] = useState<string | undefined>(
        params?.datasetId
    );

    const { push } = useRouter();

    const {
        data: dataset,
        isLoading,
        mutate: refetchDataset,
    } = useGet<Dataset>(
        isDraft
            ? `${apis.datasetsV1Url}/${datasetId}`
            : `${apis.datasetsV1Url}/${datasetId}?schema_model=${SCHEMA_NAME}&schema_version=${SCHEMA_VERSION}`,
        { shouldFetch: !!params?.teamId && !!datasetId }
    );

    const [hasError, setHasError] = useState<boolean>();
    const [existingFormData, setExistingFormData] = useState<Metadata>();
    const [struturalMetadata, setStructuralMetadata] =
        useState<StructuralMetadata[]>();

    const bannerTabList = [
        { label: t("onlineForm"), value: "FORM" },
        { label: t("uploadFile"), value: "UPLOAD" },
    ].map(tabItem => ({
        label: tabItem.label,
        value: tabItem.value,
        content: null,
    }));

    const schemaFields = formJSON.schema_fields;

    const defaultFormValues = {
        "Dataset identifier": "226fb3f1-4471-400a-8c39-2b66d46a39b6",
        "Dataset Version": "1.0.0",
        "revision version": "1.0.0",
        "revision url": "http://www.example.com/",
        "Metadata Issued Datetime": today,
        "Last Modified Datetime": today,
        "Name of data provider": "--",
        "Dataset population size": 1,
        "contact point": user?.email,
        "Observations array": null,
    };

    useEffect(() => {
        if (isLoading || !isEditing) {
            return;
        }

        if (!dataset) {
            setHasError(true);
            return;
        }

        const metadataLocation = getMetadata(isDraft);

        let latestMetadata = get(dataset, metadataLocation);

        if (isDuplicate) {
            latestMetadata = omit(latestMetadata, "summary.title");
        }

        const mappedFormData = mapExistingDatasetToFormFields(
            schemaFields,
            latestMetadata
        );

        setExistingFormData(mappedFormData);
    }, [dataset, isLoading]);

    useEffect(() => {
        if (!dataset) {
            return;
        }

        const metadataLocation = getMetadata(isDraft);

        const latestMetadata = get(dataset, metadataLocation);
        setStructuralMetadata(latestMetadata?.structuralMetadata);
    }, [dataset]);

    const generateValidationRules = useMemo(
        () => (validationFields: FormHydrationValidation[]) => {
            const transformedObject: Record<
                string,
                Omit<FormHydrationValidation, "title">
            > = {};

            validationFields.forEach(field => {
                const { title, items, ...rest } = field;

                if (items && Array.isArray(items)) {
                    transformedObject[title] = {
                        ...rest,
                        items: formatValidationItems(items),
                    };
                } else {
                    transformedObject[title] = rest;
                }
            });

            return transformedObject;
        },
        []
    );

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [guidanceText, setGuidanceText] = useState<string>();
    const [autoSaveDraft, setAutoSaveDraft] = useState<boolean>();

    const datasetVersionQuery = `input_schema=${SCHEMA_NAME}&input_version=${SCHEMA_VERSION}`;
    const postDatasetUrl = `${apis.datasetsV1Url}?${datasetVersionQuery}`;

    const createDataset = usePost<NewDataset>(
        `${postDatasetUrl}?${datasetVersionQuery}`,
        {
            itemName: "Dataset",
        }
    );

    const updateDataset = usePut<NewDataset>(apis.datasetsV1Url, {
        itemName: "Dataset",
        query: datasetVersionQuery,
    });

    const generatedYupValidation = useMemo(
        () =>
            formJSON?.validation && {
                title: "Metadata form",
                type: "object",
                properties: !isDraft
                    ? generateValidationRules(formJSON.validation)
                    : {},
            },
        [formJSON.validation, generateValidationRules, isDraft]
    );

    const yupSchema = buildYup(generatedYupValidation);

    const {
        control,
        handleSubmit,
        watch,
        clearErrors,
        trigger,
        getValues,
        reset,
        formState,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(yupSchema),
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (!existingFormData) {
            reset(defaultFormValues);
            return;
        }

        reset({ ...defaultFormValues, ...existingFormData });
    }, [existingFormData]);

    const formSections = [INITIAL_FORM_SECTION]
        .concat(
            getFirstLocationValues(schemaFields).filter(location =>
                hasVisibleFieldsForLocation(schemaFields, location)
            )
        )
        .concat([STRUCTURAL_METADATA_FORM_SECTION, SUBMISSON_FORM_SECTION]);

    const currentSectionIndex = selectedFormSection
        ? formSections.indexOf(selectedFormSection)
        : 0;

    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
    const [submissionRequested, setSubmissionRequested] =
        useState<boolean>(false);

    // When form loaded - select first form section with displayed fields
    useEffect(() => {
        const getFirstNonHiddenSection = (schemaFields: FormHydration[]) => {
            const nonHiddenField = schemaFields.find(field =>
                hasVisibleFieldsForLocation(schemaFields, field.location!)
            );
            return nonHiddenField && nonHiddenField?.location?.split(".")[0];
        };

        const initialSection = getFirstNonHiddenSection(schemaFields) || "";
        setSelectedFormSection(
            (!isEditing && INITIAL_FORM_SECTION) || initialSection
        );
    }, [schemaFields]);

    useEffect(() => {
        const createLegendItems = async () => {
            const items = await formGenerateLegendItems(
                formSections,
                selectedFormSection,
                true,
                schemaFields,
                clearErrors,
                getValues,
                trigger,
                submissionRequested
            );
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection, isDraft, existingFormData]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex + 1]);
    };

    const [navbarHeight, setNavbarHeight] = useState<string>("0");

    // Handle form legend top offset
    useEffect(() => {
        const handleResize = () => {
            const navbar = document.getElementById(NAVBAR_ID);
            if (navbar) {
                setNavbarHeight(`${navbar?.offsetHeight}px`);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoading]);

    const postForm = async (formData: Metadata) => {
        setIsSaving(true);

        const mappedFormData: Partial<Metadata> = mapFormFieldsForSubmission(
            formData,
            schemaFields
        );

        const formPayload = isEditing
            ? {
                  ...omit(dataset, ["versions"]),
                  team_id: teamId,
                  user_id: user.id,
                  status: isDraft
                      ? ("DRAFT" as DatasetStatus)
                      : ("ACTIVE" as DatasetStatus),
                  create_origin: "MANUAL" as CreateOrigin,
                  metadata: {
                      schemaModel: SCHEMA_NAME,
                      schemaVersion: SCHEMA_VERSION,
                      ...dataset?.versions[0].metadata,
                      metadata: {
                          observations: [],
                          coverage: null,
                          ...mappedFormData,
                      },
                  },
              }
            : isDuplicate
            ? {
                  ...omit(dataset, ["id", "versions"]),
                  status: isDraft
                      ? ("DRAFT" as DatasetStatus)
                      : ("ACTIVE" as DatasetStatus),
                  metadata: {
                      schemaModel: SCHEMA_NAME,
                      schemaVersion: SCHEMA_VERSION,
                      ...dataset?.versions[0].metadata,
                      metadata: {
                          observations: [],
                          coverage: null,
                          ...mappedFormData,
                      },
                  },
              }
            : {
                  team_id: teamId,
                  user_id: user.id,
                  status: isDraft
                      ? ("DRAFT" as DatasetStatus)
                      : ("ACTIVE" as DatasetStatus),
                  create_origin: "MANUAL" as CreateOrigin,
                  metadata: {
                      schemaModel: SCHEMA_NAME,
                      schemaVersion: SCHEMA_VERSION,
                      metadata: {
                          issued: new Date().toString(),
                          modified: new Date().toString(),
                          observations: [],
                          coverage: null,
                          ...mappedFormData,
                      },
                  },
              };
        try {
            const formPostRequest = isEditing
                ? await updateDataset(
                      params.datasetId,
                      formPayload as NewDataset
                  )
                : await createDataset(formPayload as NewDataset);

            if (formPostRequest !== null && !autoSaveDraft) {
                reset({});
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`
                );
            } else {
                setIsSaving(false);

                if (formPostRequest && autoSaveDraft) {
                    setDatasetId(formPostRequest as string);
                    setAutoSaveDraft(false);
                }
            }
        } catch (err) {
            setIsSaving(false);
        }
    };

    const formSubmit = (formData: Metadata) => {
        postForm(formData);
    };

    const handleFormSubmission = async (isDraft: boolean) => {
        if (!isDraft) {
            const formIsValid = await trigger();
            if (formIsValid) {
                handleSubmit(formSubmit)();
            } else {
                setSelectedFormSection(formSections[formSections.length - 1]);
            }
        } else {
            handleSubmit(formSubmit)();
        }
    };

    const handleMakeActive = async () => {
        setSubmissionRequested(true);
        setIsDraft(false);
        handleFormSubmission(false);
    };

    const handleSaveDraft = async () => {
        setDraftToggled(true);
        setIsDraft(true);
        handleFormSubmission(true);
    };

    // Handle submission after draft toggle
    useEffect(() => {
        if (isDraft === undefined) {
            setIsDraft(false);
            return;
        }

        if (!isDraft) {
            clearErrors();
        }

        if (isDraft && draftToggled) {
            handleFormSubmission(isDraft);
        }
    }, [isDraft, clearErrors, draftToggled]);

    const [optionalPercentage, setOptionalPercentage] = useState(0);
    const [requiredPercentage, setRequiredPercentage] = useState(0);

    const watchAll = watch();

    useEffect(() => {
        setOptionalPercentage(
            formGetFieldsCompletedCount(schemaFields, getValues, true)
        );
        setRequiredPercentage(
            formGetFieldsCompletedCount(schemaFields, getValues, false)
        );
    }, [getValues, schemaFields, watchAll]);

    const updateGuidanceText = (fieldName: string, fieldArrayName?: string) => {
        if (fieldArrayName) {
            setGuidanceText(
                formJSON.schema_fields
                    .find(field => field.title === fieldArrayName)
                    ?.fields?.find(field => field.title === fieldName)
                    ?.guidance?.replaceAll("\\n", "\n")
            );
        } else {
            setGuidanceText(
                formJSON.schema_fields
                    .find(field => field.title === fieldName)
                    ?.guidance?.replaceAll("\\n", "\n")
            );
        }
    };

    const isStructuralMetadataSection =
        selectedFormSection === STRUCTURAL_METADATA_FORM_SECTION;

    // Dataset needs to be saved before adding structural metadata
    useEffect(() => {
        if (selectedFormSection !== STRUCTURAL_METADATA_FORM_SECTION) {
            return;
        }

        if (!datasetId) {
            setAutoSaveDraft(true);
            handleSaveDraft();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection, datasetId]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty,
        onSuccess: handleSaveDraft,
        modalProps: {
            cancelText: t("discardChanges"),
            confirmText: t("saveAsDraft"),
            title: t("confirmSave"),
            content: "",
        },
    });

    if (isEditing && isLoading) {
        return <Loading />;
    }

    if (hasError) {
        return (
            <Box>
                <Typography variant="h2">{t("errorLoading")}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`}
                underline="hover"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pb: 0.5,
                    pl: 2,
                }}>
                <ArrowBackIosNewIcon fontSize="small" />
                {t("backToManagementPage")}
            </Link>

            <FormBanner
                tabItems={bannerTabList}
                downloadAction={() => console.log("DOWNLOAD")}
                makeActiveAction={handleMakeActive}
                saveAsDraftAction={handleSaveDraft}
                completionPercentage={requiredPercentage}
                optionalPercentage={optionalPercentage}
                actionButtonsEnabled={!isSaving}
            />

            {currentSectionIndex === 0 && <IntroScreen />}

            {currentSectionIndex > 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", p: 0 }}>
                    <Box
                        sx={{
                            flex: 1,
                            padding: theme.spacing(1),
                        }}>
                        <FormLegend
                            items={legendItems.filter(
                                (item: LegendItem) =>
                                    item.name !== INITIAL_FORM_SECTION &&
                                    item.name !== SUBMISSON_FORM_SECTION
                            )}
                            handleClickItem={handleLegendClick}
                            offsetTop={navbarHeight}
                        />
                    </Box>

                    {currentSectionIndex < formSections.length - 1 ? (
                        <>
                            <Box sx={{ flex: 2, p: 0 }}>
                                {isStructuralMetadataSection && (
                                    <StructuralMetadataSection
                                        selectedFormSection={
                                            selectedFormSection
                                        }
                                        datasetId={datasetId}
                                        structuralMetadata={struturalMetadata}
                                        fileProcessedAction={() => {
                                            refetchDataset();
                                            notificationService.apiSuccess(
                                                "Your data has been successfully uploaded"
                                            );
                                        }}
                                    />
                                )}

                                {!isStructuralMetadataSection && (
                                    <Form onSubmit={handleSubmit(formSubmit)}>
                                        <Paper
                                            sx={{
                                                marginTop: "10px",
                                                marginBottom: "10px",
                                                padding: 2,
                                            }}>
                                            <Typography variant="h2">
                                                {capitalise(
                                                    splitCamelcase(
                                                        selectedFormSection
                                                    )
                                                )}
                                            </Typography>

                                            <Box sx={{ p: 0 }}>
                                                {selectedFormSection &&
                                                    schemaFields
                                                        .filter(
                                                            schemaField =>
                                                                !schemaField
                                                                    .field
                                                                    ?.hidden
                                                        )
                                                        .filter(
                                                            ({ location }) =>
                                                                location?.startsWith(
                                                                    selectedFormSection
                                                                )
                                                        )
                                                        .map(fieldParent => {
                                                            const {
                                                                field,
                                                                fields,
                                                            } = fieldParent;

                                                            return fields?.length ? (
                                                                <FormFieldArray
                                                                    control={
                                                                        control
                                                                    }
                                                                    schemaFields={
                                                                        fields
                                                                    }
                                                                    fieldParent={
                                                                        fieldParent
                                                                    }
                                                                    setSelectedField={
                                                                        updateGuidanceText
                                                                    }
                                                                />
                                                            ) : (
                                                                field &&
                                                                    renderFormHydrationField(
                                                                        field,
                                                                        control,
                                                                        undefined,
                                                                        updateGuidanceText
                                                                    )
                                                            );
                                                        })}
                                            </Box>
                                        </Paper>
                                    </Form>
                                )}
                            </Box>
                            <Paper
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    padding: theme.spacing(2),
                                    margin: theme.spacing(1.25),
                                    wordBreak: "break-word",
                                }}>
                                <Typography variant="h2">
                                    {t("guidance")}
                                </Typography>

                                {guidanceText && (
                                    <Markdown>{guidanceText}</Markdown>
                                )}
                            </Paper>
                        </>
                    ) : (
                        <Box sx={{ flex: 3, p: 0 }}>
                            <SubmissionScreen
                                trigger={trigger}
                                makeActiveAction={handleMakeActive}
                                makeActiveDisabled={isSaving}
                            />
                        </Box>
                    )}
                </Box>
            )}

            <Box sx={{ padding: theme.spacing(1), margin: theme.spacing(2) }}>
                <FormFooter>
                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                setSelectedFormSection(
                                    formSections[currentSectionIndex - 1]
                                )
                            }
                            disabled={isFirstSection(currentSectionIndex)}
                            variant="text"
                            startIcon={<ArrowBackIosNewIcon />}>
                            {t("previous")}
                        </Button>
                    </FormFooterItem>

                    <FormFooterItem>
                        <Button
                            onClick={() =>
                                setSelectedFormSection(
                                    formSections[currentSectionIndex + 1]
                                )
                            }
                            disabled={isLastSection(
                                formSections,
                                currentSectionIndex
                            )}
                            endIcon={<ArrowForwardIosIcon />}>
                            {t("next")}
                        </Button>
                    </FormFooterItem>
                </FormFooter>
            </Box>
        </>
    );
};

export default CreateDataset;
