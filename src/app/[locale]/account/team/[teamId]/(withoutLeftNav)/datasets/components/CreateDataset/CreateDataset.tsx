"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { buildYup } from "schema-to-yup";
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
import theme from "@/config/theme";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
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
import IntroScreen from "../IntroScreen/IntroScreen";
import { FormFooter, FormFooterItem } from "./CreateDataset.styles";
import FormFieldArray from "./FormFieldArray";

interface CreateDatasetProps {
    formJSON: FormHydrationSchema;
}

const INITIAL_FORM_SECTION = "Home";

const CreateDataset = ({ formJSON }: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const bannerTabList = [
        { label: t("onlineForm"), value: "FORM" },
        { label: t("uploadFile"), value: "UPLOAD" },
    ].map(tabItem => ({
        label: tabItem.label,
        value: tabItem.value,
        content: null,
    }));

    const schemaFields = formJSON.schema_fields;

    const generateValidationRules = (
        validationFields: FormHydrationValidation[]
    ) => {
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
    };

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");

    const generatedYupValidation = formJSON?.validation && {
        title: "Metadata form",
        type: "object",
        properties: generateValidationRules(formJSON.validation),
    };

    const yupSchema = buildYup(generatedYupValidation);

    const { control, handleSubmit, watch, clearErrors, trigger, getValues } =
        useForm({
            mode: "onTouched",
            resolver: yupResolver(yupSchema),
        });

    const formSections = [INITIAL_FORM_SECTION].concat(
        getFirstLocationValues(schemaFields).filter(location =>
            hasVisibleFieldsForLocation(schemaFields, location)
        )
    );

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

    // TODO - form submission
    const formSubmit = (formData: unknown) => {
        console.log(formData);
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
                makeActiveAction={() => console.log("MAKE ACTIVE")}
                saveAsDraftAction={() => console.log("SAVE AS DRAFT")}
                completionPercentage={requiredPercentage}
                optionalPercentage={optionalPercentage}
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
                                item => item.name !== INITIAL_FORM_SECTION
                            )}
                            handleClickItem={handleLegendClick}
                            offsetTop={navbarHeight}
                        />
                    </Box>
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
                                        splitCamelcase(selectedFormSection)
                                    )}
                                </Typography>

                                <Box sx={{ p: 0 }}>
                                    {selectedFormSection &&
                                        schemaFields
                                            .filter(
                                                schemaField =>
                                                    !schemaField.field?.hidden
                                            )
                                            .filter(({ location }) =>
                                                location.startsWith(
                                                    selectedFormSection
                                                )
                                            )
                                            .map(fieldParent => {
                                                const { field, fields } =
                                                    fieldParent;

                                                return fields?.length ? (
                                                    <FormFieldArray
                                                        control={control}
                                                        schemaFields={fields}
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
                        <Typography variant="h2">{t("guidance")}</Typography>
                    </Paper>
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
