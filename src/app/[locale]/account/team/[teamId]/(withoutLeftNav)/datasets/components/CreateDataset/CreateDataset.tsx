"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { get, omit } from "lodash";
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
    FormHydrationSchema,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem } from "@/interfaces/FormLegend";
import { Team } from "@/interfaces/Team";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormBanner, { NAVBAR_ID } from "@/components/FormBanner/FormBanner";
import FormLegend from "@/components/FormLegend";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { DataStatus } from "@/consts/application";
import {
    DATA_CUSTODIAN_FIELDS,
    DATA_CUSTODIAN_ID,
    DATA_CUSTODIAN_NAME,
    DATASET_TYPE,
    INITIAL_FORM_SECTION,
    STRUCTURAL_METADATA_FORM_SECTION,
    SUBMISSON_FORM_SECTION,
} from "@/consts/createDataset";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { getToday } from "@/utils/date";
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
    defaultTeamId: number;
}

type FormValues = Record<string, unknown>;

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "3.0.0";

const getMetadata = (isDraft: boolean) =>
    isDraft
        ? "versions[0].metadata.original_metadata"
        : "versions[0].metadata.metadata";

const today = getToday();

const CreateDataset = ({
    formJSON,
    teamId,
    user,
    defaultTeamId,
}: CreateDatasetProps) => {
    const [formJSONDynamic, setFormJSONDynamic] = useState<
        FormHydrationSchema | undefined
    >();

    const [currentTeamId, setCurrentTeamId] = useState<number>(defaultTeamId);

    const [searchName, setSearchName] = useState("");
    const searchNameDebounced = useDebounce(searchName, 500);

    const { data: teamData, isLoading: isLoadingTeams } = useGet<Team[]>(
        `${apis.teamsSearchV1Url}?name=${searchNameDebounced}`,
        {
            shouldFetch: !!searchNameDebounced,
        }
    );

    const currentFormJSON = useMemo(() => {
        return formJSONDynamic || formJSON;
    }, [formJSON, formJSONDynamic]);

    const teamOptions = useMemo(() => {
        const defaultOption =
            !!currentFormJSON.defaultValues[DATA_CUSTODIAN_ID] &&
            !!currentFormJSON.defaultValues[DATA_CUSTODIAN_NAME]
                ? {
                      value: currentFormJSON.defaultValues[DATA_CUSTODIAN_ID],
                      label: currentFormJSON.defaultValues[DATA_CUSTODIAN_NAME],
                  }
                : {};

        if (!teamData) return defaultOption.label ? [defaultOption] : [];

        const hasOption = teamData?.some(
            data => data.id.toString() === defaultOption.value?.toString()
        );

        return [
            ...(!hasOption && defaultOption.label ? [defaultOption] : []),
            ...(teamData?.map(data => ({
                label: data.name,
                value: data.id,
            })) || []),
        ] as OptionsType[];
    }, [teamData]);

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

    const [finishedLoadingExisting, setFinishedLoadingExisting] =
        useState<boolean>();

    const { push } = useRouter();

    const { data: dataset, isLoading } = useGet<Dataset>(
        searchParams?.get("status") === DataStatus.DRAFT
            ? `${apis.datasetsV1Url}/${datasetId}`
            : `${apis.datasetsV1Url}/${datasetId}?schema_model=${SCHEMA_NAME}&schema_version=${SCHEMA_VERSION}`,
        { shouldFetch: !!params?.teamId && !!datasetId }
    );

    const [hasError, setHasError] = useState<boolean>();
    const [existingFormData, setExistingFormData] = useState<Metadata>();
    const [structuralMetadata, setStructuralMetadata] = useState<
        StructuralMetadata[]
    >([]);

    const schemaFields = currentFormJSON.schema_fields;

    const defaultFormValues = {
        ...currentFormJSON.defaultValues,
        "Dataset identifier": "226fb3f1-4471-400a-8c39-2b66d46a39b6",
        "Dataset Version": "1.0.0",
        "revision version": "1.0.0",
        "revision url": "http://www.example.com/",
        identifier: teamId,
        "Metadata Issued Datetime": today,
        "Last Modified Datetime": today,
        "Name of data provider": "--",
        "Dataset population size": -1,
        "Follow-up": null,
        "contact point":
            currentFormJSON.defaultValues.contact_point || user?.email, // this is a hidden field and goes no where but it is summary.dataCustodian.contact_point
        "Contact point": user?.email, // summary.contact_point
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

        setStructuralMetadata(latestMetadata?.structuralMetadata?.tables || []);

        const mappedFormData = mapExistingDatasetToFormFields(
            schemaFields,
            latestMetadata
        );

        setExistingFormData(mappedFormData);
    }, [dataset, isLoading]);

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
            currentFormJSON?.validation && {
                title: "Metadata form",
                type: "object",
                properties: !isDraft
                    ? generateValidationRules(currentFormJSON.validation)
                    : {},
            },
        [currentFormJSON.validation, generateValidationRules, isDraft]
    );

    const yupSchema = buildYup(generatedYupValidation);

    const {
        control,
        handleSubmit,
        watch,
        clearErrors,
        trigger,
        getValues,
        setValue,
        reset,
        formState,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(yupSchema),
        defaultValues: defaultFormValues,
    });

    const watchId = watch(DATA_CUSTODIAN_ID);
    const watchType = watch(DATASET_TYPE);

    // This is a bit of a hack
    // - the data_custodian_id is coming back as a persistent ID due to a confusing in naming/bug
    // - we need to make sure therefore that the watchId, from the form, for data custodian identifier
    //    if an identifier, and not a persistent identifier
    const watchIdIsNumber = !Number.isNaN(Number(watchId));

    const { data: formJSONUpdated } = useGet<FormHydrationSchema>(
        `${apis.formHydrationV1Url}?name=${SCHEMA_NAME}&version=${SCHEMA_VERSION}&dataTypes=${watchType}&team_id=${watchId}`,
        {
            shouldFetch: watchIdIsNumber,
        }
    );

    useEffect(() => {
        if (!watchId) return;
        setCurrentTeamId(watchId);
    }, [watchId]);

    const updateDataCustodian = (formJSONUpdated: FormHydrationSchema) => {
        const custodianOverrides = DATA_CUSTODIAN_FIELDS.reduce((acc, key) => {
            acc[key] = formJSONUpdated.defaultValues[key];
            return acc;
        }, {});

        const defaultFormValues = {
            ...getValues(),
            ...custodianOverrides,
        };

        reset(defaultFormValues);
    };

    useEffect(() => {
        if (formJSONUpdated) {
            setFormJSONDynamic(formJSONUpdated);
            updateDataCustodian(formJSONUpdated);
        } else {
            setFormJSONDynamic(undefined);
        }
    }, [formJSONUpdated]);

    useEffect(() => {
        if (!isEditing) {
            setFinishedLoadingExisting(true);
            return;
        }

        if (existingFormData) {
            reset({ ...defaultFormValues, ...existingFormData });
            setFinishedLoadingExisting(true);
        }
    }, [existingFormData, isEditing]);

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
    const [submissionRequested, setSubmissionRequested] = useState<boolean>(
        !!isEditing
    );

    // When form loaded - select first form section with displayed fields
    useEffect(() => {
        if (selectedFormSection) {
            return;
        }

        setSelectedFormSection(INITIAL_FORM_SECTION);
    }, [schemaFields, selectedFormSection]);

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
                submissionRequested,
                formState.dirtyFields
            );
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection, isDraft, existingFormData]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex]);
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

    const postForm = async (formData: Metadata, saveAsDraft: boolean) => {
        setIsSaving(true);

        const mappedFormData: Partial<Metadata> = mapFormFieldsForSubmission(
            formData,
            schemaFields
        );

        const formPayload =
            isEditing && !isDuplicate
                ? {
                      ...omit(dataset, ["versions"]),
                      team_id: teamId,
                      user_id: user.id,
                      status: saveAsDraft
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
                              structuralMetadata: {
                                  tables: structuralMetadata,
                              },
                              ...mappedFormData,
                          },
                      },
                  }
                : isDuplicate
                ? {
                      ...omit(dataset, ["id", "versions"]),
                      status: saveAsDraft
                          ? ("DRAFT" as DatasetStatus)
                          : ("ACTIVE" as DatasetStatus),
                      metadata: {
                          schemaModel: SCHEMA_NAME,
                          schemaVersion: SCHEMA_VERSION,
                          ...dataset?.versions[0].metadata,
                          metadata: {
                              observations: [],
                              coverage: null,
                              structuralMetadata: {
                                  tables: structuralMetadata,
                              },
                              ...mappedFormData,
                          },
                      },
                  }
                : {
                      team_id: teamId,
                      user_id: user.id,
                      status: saveAsDraft
                          ? ("DRAFT" as DatasetStatus)
                          : ("ACTIVE" as DatasetStatus),
                      create_origin: "MANUAL" as CreateOrigin,
                      metadata: {
                          schemaModel: SCHEMA_NAME,
                          schemaVersion: SCHEMA_VERSION,
                          metadata: {
                              observations: [],
                              coverage: null,
                              structuralMetadata: {
                                  tables: structuralMetadata,
                              },
                              ...mappedFormData,
                              issued: today,
                              modified: today,
                          },
                      },
                  };
        try {
            const observations = formPayload?.metadata?.metadata?.observations;
            if (Array.isArray(observations)) {
                const personObservations = formPayload?.metadata?.metadata?.observations?.find(obj => obj.observedNode === 'Persons')
                if (personObservations) {
                    formPayload?.metadata?.metadata?.summary?.populationSize = Number(personObservations.measuredValue)
                }
            }

            // BES 11/24 Put in as a quick fix for teams with identifier < 2 characters long
            // This is very schema specific and should be removed once a schema update is made
            // to allow shorter identifiers.
            if (
                formPayload?.metadata?.metadata?.summary?.dataCustodian
                    ?.identifier.length === 1
            ) {
                formPayload.metadata.metadata.summary.dataCustodian.identifier =
                    formPayload.metadata.metadata.summary.dataCustodian.identifier.padStart(
                        2,
                        "0"
                    );
            }
            const formPostRequest =
                isEditing && !isDuplicate
                    ? await updateDataset(
                          params.datasetId,
                          formPayload as NewDataset
                      )
                    : await createDataset(formPayload as NewDataset);

            if (formPostRequest !== null) {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${
                        RouteName.DATASETS
                    }?tab=${saveAsDraft ? "DRAFT " : "ACTIVE"}`
                );
            } else {
                setIsSaving(false);

                if (formPostRequest) {
                    setDatasetId(formPostRequest as string);
                }
            }
        } catch (err) {
            setIsSaving(false);
        }
    };

    const formSubmit = (formData: Metadata, saveAsDraft: boolean) => {
        postForm(formData, saveAsDraft);
    };

    const handleFormSubmission = async (saveAsDraft: boolean) => {
        if (!saveAsDraft) {
            const formIsValid = await trigger();
            if (formIsValid) {
                handleSubmit(data => formSubmit(data, saveAsDraft))();
            } else {
                setSelectedFormSection(formSections[formSections.length - 1]);
            }
        } else {
            handleSubmit(data => formSubmit(data, saveAsDraft))();
        }
    };

    const handleMakeActive = async () => {
        setSubmissionRequested(true);
        setIsDraft(false);
        handleFormSubmission(false);
    };

    const handleSaveDraft = async () => {
        if (!isDraft) {
            setIsDraft(true);
        }

        if (!draftToggled) {
            setDraftToggled(true);
        } else {
            handleFormSubmission(true);
        }
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
                currentFormJSON.schema_fields
                    .find(field => field.title === fieldArrayName)
                    ?.fields?.find(field => field.title === fieldName)
                    ?.guidance?.replaceAll("\\n", "\n")
            );
        } else {
            setGuidanceText(
                currentFormJSON.schema_fields
                    .find(field => field.title === fieldName)
                    ?.guidance?.replaceAll("\\n", "\n")
            );
        }
    };

    const isStructuralMetadataSection =
        selectedFormSection === STRUCTURAL_METADATA_FORM_SECTION;

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

    if ((isEditing && isLoading) || !finishedLoadingExisting) {
        return <Loading />;
    }

    if (hasError) {
        return (
            <Box>
                <Typography variant="h2">{t("errorLoading")}</Typography>
            </Box>
        );
    }

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

    return (
        <>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${
                    RouteName.DATASETS
                }?tab=${isDraft ? "DRAFT " : "ACTIVE"}`}
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
                makeActiveAction={handleMakeActive}
                saveAsDraftAction={handleSaveDraft}
                completionPercentage={requiredPercentage}
                optionalPercentage={optionalPercentage}
                actionButtonsEnabled={!isSaving}
            />

            <Box sx={{ display: "flex", flexDirection: "row", p: 0 }}>
                <Box
                    sx={{
                        flex: 1,
                        padding: theme.spacing(1),
                    }}>
                    <FormLegend
                        items={legendItems}
                        handleClickItem={handleLegendClick}
                        offsetTop={navbarHeight}
                    />
                </Box>

                {currentSectionIndex === 0 && (
                    <IntroScreen
                        defaultValue={watchType || []}
                        setDatasetType={(value: string) => {
                            setValue(DATASET_TYPE, value);
                        }}
                        teamOptions={teamOptions}
                        handleOnUserInputChange={handleOnUserInputChange}
                        setDataCustodian={(value: number) =>
                            setValue(DATA_CUSTODIAN_ID, value)
                        }
                        defaultTeamId={currentTeamId}
                        isLoadingTeams={isLoadingTeams}
                    />
                )}

                {currentSectionIndex < formSections.length - 1 &&
                currentSectionIndex > 0 ? (
                    <>
                        <Box sx={{ flex: 2, p: 0 }}>
                            {isStructuralMetadataSection && (
                                <StructuralMetadataSection
                                    selectedFormSection={selectedFormSection}
                                    structuralMetadata={structuralMetadata}
                                    fileProcessedAction={(
                                        metadata: StructuralMetadata[]
                                    ) => {
                                        notificationService.apiSuccess(
                                            t("uploadSuccess")
                                        );
                                        setStructuralMetadata(metadata);
                                    }}
                                    handleToggleUploading={setIsSaving}
                                />
                            )}

                            {!isStructuralMetadataSection &&
                                currentSectionIndex > 0 && (
                                    <Form>
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
                                                                    formArrayValues={
                                                                        getValues(
                                                                            fieldParent.title
                                                                        ) as unknown as FormValues[]
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
                        {currentSectionIndex > 0 && (
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
                                    <MarkDownSanitizedWithHtml
                                        content={guidanceText}
                                    />
                                )}
                            </Paper>
                        )}
                    </>
                ) : (
                    currentSectionIndex > 0 && (
                        <Box sx={{ flex: 3, p: 0 }}>
                            <SubmissionScreen
                                trigger={trigger}
                                errors={formState.errors}
                                makeActiveAction={handleMakeActive}
                                makeActiveDisabled={isSaving}
                            />
                        </Box>
                    )
                )}
            </Box>

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
