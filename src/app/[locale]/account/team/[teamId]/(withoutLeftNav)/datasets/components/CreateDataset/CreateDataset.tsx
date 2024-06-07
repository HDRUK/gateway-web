"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { set } from "lodash";
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

const CreateDataset = ({ formJSON, teamId, userId }: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { push } = useRouter();

    const createDataset = usePost<NewDataset>(apis.datasetsV1Url, {
        itemName: "Dataset",
    });

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

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const generatedYupValidation = useMemo(
        () =>
            formJSON?.validation && {
                title: "Metadata form",
                type: "object",
                properties: generateValidationRules(formJSON.validation),
            },
        [formJSON.validation, generateValidationRules]
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
                trigger
            );
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection]);

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
        console.log("here", formData, schemaFields);

        const transformObject = (data, mappings) => {
            // Create a dictionary to map titles to locations
            const titleToLocation = {};
            mappings.forEach(mapping => {
                titleToLocation[mapping.title] = mapping.location;
            });

            // Transform the data object
            const transformedObject = {};
            for (const key in data) {
                if (titleToLocation[key]) {
                    transformedObject[titleToLocation[key]] = data[key];
                }
            }

            const nestedObj = {};

            // eslint-disable-next-line no-restricted-syntax
            for (const key in transformedObject) {
                set(nestedObj, key, transformedObject[key]);
            }

            return nestedObj;
        };

        const mappedFormData: Metadata = transformObject(
            formData,
            schemaFields
        );
        console.log(mappedFormData);

        const formPayload = {
            team_id: teamId,
            user_id: userId,
            status: "ACTIVE" as DatasetStatus,
            pid: null,
            updated: "",
            create_origin: "MANUAL" as CreateOrigin,
            label: "ABC DATASET",
            short_description: "lorem ipsum assaasdas as 1",
            metadata: {
                metadata: {
                    identifier:
                        "https://web.www.healthdatagateway.org/3935e2fd-0c30-4f56-8388-45a02e0499b4",
                    version: "0.6.8",
                    issued: "2020-08-10T00:00:00.000Z",
                    modified: "2020-08-10T00:00:00.000Z",
                    revisions: [],

                    summary: {
                        ...mappedFormData.summary,
                        // title: "Bridge file: Hospital Episode Statistics to Diagnostic Imaging Dataset",
                        // abstract:
                        //     "Linked Data Set - Hospital Episode Statistics to Diagnostic Imaging Data Set",
                        publisher: {
                            identifier: "https://5f86cd34980f41c6f02261f4",
                            name: "NHS DIGITAL",
                            logo: "",
                            description: "",
                            contactPoint: null,
                            memberOf: "ALLIANCE",
                        },
                        // contactPoint: "enquiries@nhsdigital.nhs.uk",
                        keywords: null,
                        alternateIdentifiers: null,
                        doiName: "",
                    },

                    documentation: {
                        // ...mappedFormData.documentation,
                        description:
                            "Linked Data Set - Hospital Episode Statistics to Diagnostic Imaging Data Set",
                        associatedMedia: null,
                        isPartOf: null,
                    },
                    coverage: {
                        spatial: "United Kingdom,England",
                        typicalAgeRange: "",
                        physicalSampleAvailability: null,
                        followup: "",
                        pathway: "",
                    },
                    provenance: {
                        origin: {
                            purpose: null,
                            source: null,
                            collectionSituation: null,
                        },
                        temporal: {
                            accrualPeriodicity: "MONTHLY",
                            distributionReleaseDate: null,
                            startDate: "2007-01-04",
                            endDate: null,
                            timeLag: null,
                        },
                    },
                    accessibility: {
                        usage: {
                            dataUseLimitation: null,
                            dataUseRequirements: null,
                            resourceCreator: null,
                            investigations: null,
                            isReferencedBy: null,
                        },
                        access: {
                            accessRights:
                                "https://digital.nhs.uk/binaries/content/assets/website-assets/services/dars/nhs_digital_approved_edition_2_dsa_demo.pdf",
                            accessService: null,
                            accessRequestCost: null,
                            deliveryLeadTime: null,
                            jurisdiction: "GB-ENG",
                            dataProcessor: null,
                            dataController: null,
                        },
                        formatAndStandards: {
                            vocabularyEncodingScheme: null,
                            conformsTo: null,
                            language: null,
                            format: null,
                        },
                    },
                    enrichmentAndLinkage: {
                        qualifiedRelation: null,
                        derivation: null,
                        tools: null,
                    },
                    observations: [],
                    structuralMetadata: [
                        {
                            name: "All Available Fields",
                            description: null,
                            elements: [
                                {
                                    name: "All Available Fields",
                                    description: "All Available Fields",
                                    dataType: "String",
                                    sensitive: false,
                                },
                            ],
                        },
                        {
                            name: "General fields",
                            description: null,
                            elements: [
                                {
                                    name: "MATCH_RANK",
                                    description: null,
                                    dataType: "Character",
                                    sensitive: false,
                                },
                            ],
                        },
                        {
                            name: "General fields",
                            description: null,
                            elements: [
                                {
                                    name: "HES_DIDS_VERSION",
                                    description: null,
                                    dataType: "Character",
                                    sensitive: false,
                                },
                            ],
                        },
                        {
                            name: "General fields",
                            description: null,
                            elements: [
                                {
                                    name: "SUBMISSIONDATAID",
                                    description: null,
                                    dataType: "Character",
                                    sensitive: false,
                                },
                            ],
                        },
                        {
                            name: "General fields",
                            description: null,
                            elements: [
                                {
                                    name: "ENCRYPTED_HESID",
                                    description: null,
                                    dataType: "Character",
                                    sensitive: false,
                                },
                            ],
                        },
                    ],
                },
            },
        };

        console.log(formPayload);

        setIsSaving(true);

        try {
            const postTest = await createDataset(formPayload);

            if (postTest) {
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

    const handleMakeActive = async () => {
        const formIsValid = await trigger();

        if (formIsValid) {
            handleSubmit(formSubmit)();
        } else {
            setSelectedFormSection(formSections[formSections.length - 1]);
        }
    };

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

    return (
        <>
            <FormBanner
                tabItems={bannerTabList}
                downloadAction={() => console.log("DOWNLOAD")}
                makeActiveAction={handleMakeActive}
                saveAsDraftAction={() => console.log("SAVE AS DRAFT")}
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
                                                            />
                                                        ) : (
                                                            field &&
                                                                renderFormHydrationField(
                                                                    field,
                                                                    control
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
