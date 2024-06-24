"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { buildYup } from "schema-to-yup";
import {
    CreateOrigin,
    DatasetStatus,
    Metadata,
    NewDataset,
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
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import theme from "@/config/theme";
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
import SubmissionScreen from "../SubmissionScreen";
import { FormFooter, FormFooterItem } from "./CreateDataset.styles";
import FormFieldArray from "./FormFieldArray";

interface CreateDatasetProps {
    formJSON: FormHydrationSchema;
    teamId: number;
    userId: number;
}

const INITIAL_FORM_SECTION = "Home";
const SUBMISSON_FORM_SECTION = "Submission";
const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "2.2.1";

const CreateDataset = ({ formJSON, teamId, userId }: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { push } = useRouter();

    const bannerTabList = [
        { label: t("onlineForm"), value: "FORM" },
        { label: t("uploadFile"), value: "UPLOAD" },
    ].map(tabItem => ({
        label: tabItem.label,
        value: tabItem.value,
        content: null,
    }));

    const schemaFields = formJSON.schema_fields;

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

    const [isDraft, setIsDraft] = useState<boolean>();
    const [selectedFormSection, setSelectedFormSection] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [guidanceText, setGuidanceText] = useState<string>();

    const postDatasetUrl = isDraft
        ? `${apis.datasetsV1Url}?input_schema=${SCHEMA_NAME}&input_version=${SCHEMA_VERSION}`
        : apis.datasetsV1Url;

    const createDataset = usePost<NewDataset>(postDatasetUrl, {
        itemName: "Dataset",
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

    const { control, handleSubmit, watch, clearErrors, trigger, getValues } =
        useForm({
            mode: "onTouched",
            resolver: yupResolver(yupSchema),
        });

    const formSections = [INITIAL_FORM_SECTION]
        .concat(
            getFirstLocationValues(schemaFields).filter(location =>
                hasVisibleFieldsForLocation(schemaFields, location)
            )
        )
        .concat(SUBMISSON_FORM_SECTION);

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
                hasVisibleFieldsForLocation(schemaFields, field.location)
            );
            return nonHiddenField && nonHiddenField.location.split(".")[0];
        };

        const initialSection = getFirstNonHiddenSection(schemaFields) || "";
        setSelectedFormSection(INITIAL_FORM_SECTION || initialSection);
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
    }, [selectedFormSection, isDraft]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex + 1]);
    };

    const [navbarHeight, setNavbarHeight] = useState<string>();

    // Handle form legend top offset
    useEffect(() => {
        const handleResize = () => {
            const navbar = document.getElementById(NAVBAR_ID);
            setNavbarHeight(`${navbar?.offsetHeight}px`);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const postForm = async (formData: Metadata) => {
        setIsSaving(true);

        const mappedFormData: Partial<Metadata> = mapFormFieldsForSubmission(
            formData,
            schemaFields
        );

        const formPayload = {
            team_id: teamId,
            user_id: userId,
            status: isDraft
                ? ("DRAFT" as DatasetStatus)
                : ("ACTIVE" as DatasetStatus),
            pid: null,
            updated: "",
            create_origin: "MANUAL" as CreateOrigin,
            label: "",
            short_description: "",
            metadata: {
                metadata: {
                    identifier:
                        "https://web.www.healthdatagateway.org/3935e2fd-0c30-4f56-8388-45a02e0499b4",
                    version: "0.6.8",
                    issued: new Date().toString(),
                    modified: new Date().toString(),
                    revisions: [],
                    ...mappedFormData,
                },
            },
        };

        try {
            const formPostRequest = await createDataset(
                formPayload as NewDataset
            );

            if (formPostRequest) {
                push(
                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`
                );
            } else {
                setIsSaving(false);
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

        handleFormSubmission(isDraft);
    }, [isDraft, clearErrors]);

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

    return (
        <>
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
                                item =>
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
                                                            !schemaField.field
                                                                ?.hidden
                                                    )
                                                    .filter(({ location }) =>
                                                        location.startsWith(
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
                            </Box>
                            <Paper
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    padding: theme.spacing(2),
                                    margin: theme.spacing(1.25),
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
