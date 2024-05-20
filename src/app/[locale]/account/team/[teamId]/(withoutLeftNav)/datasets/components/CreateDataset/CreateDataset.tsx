"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { buildYup } from "schema-to-yup";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import { LegendItem } from "@/interfaces/FormLegend";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormBanner from "@/components/FormBanner";
import { NAVBAR_ID } from "@/components/FormBanner/FormBanner";
import FormLegend from "@/components/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { inputComponents } from "@/config/forms";
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
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    isFirstSection,
    isLastSection,
} from "@/utils/formHydration";
import { capitalise, splitCamelcase } from "@/utils/general";
import IntroScreen from "../IntroScreen/IntroScreen";
import { FormFooter, FormFooterItem } from "./CreateDataset.styles";
import formSchema from "./config/form.json";

interface FieldValidation {
    [key: string]: unknown;
}

interface SchemaValidation {
    [key: string]: FieldValidation;
}

const INITIAL_FORM_SECTION = "Home";

const CreateDataset = () => {
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

    const schemaFields: FormHydration[] = formSchema.schema_fields;

    const generateValidationRules = (schemaFields: FormHydration[]) => {
        const validationRules: SchemaValidation = {};

        schemaFields.forEach(fieldTest => {
            const { title, validation, field } = fieldTest;

            if (validation?.schema && !field.hidden) {
                const { schema: fieldValidation } = validation;

                const validationProps = fieldValidation.properties.field;

                if (fieldValidation && validationProps) {
                    validationRules[title] = validationProps;
                }
            }
        });

        return validationRules;
    };

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");

    const generatedYupValidation = {
        title: "Metadata form",
        type: "object",
        properties: generateValidationRules(schemaFields),
    };

    const yupSchema = buildYup(generatedYupValidation);

    const { control, handleSubmit, clearErrors, trigger, getValues } = useForm({
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

    const renderFormHydrationField = ({
        name,
        required,
        component,
        placeholder,
        ...rest
    }: FormHydrationField) => {
        const componentType = inputComponents[component as ComponentTypes];

        return (
            <InputWrapper
                {...rest}
                label={name || ""}
                name={name}
                key={name}
                placeholder={placeholder || ""}
                component={componentType}
                required={required}
                control={control}
                showClearButton={false}
                canCreate={component === "Autocomplete"}
                selectOnFocus={component === "Autocomplete"}
                clearOnBlur={component === "Autocomplete"}
                handleHomeEndKeys={component === "Autocomplete"}
                multiple={component === "Autocomplete"}
                isOptionEqualToValue={(
                    option: {
                        value: string | number;
                        label: string;
                    },
                    value: string | number
                ) => option.value === value}
                getChipLabel={(
                    options: {
                        value: string | number;
                        label: string;
                    }[],
                    value: unknown
                ) => options.find(option => option.value === value)?.label}
            />
        );
    };

    // TODO - form submission
    const formSubmit = (formData: unknown) => {
        console.log(formData);
    };

    return (
        <>
            <FormBanner
                tabItems={bannerTabList}
                downloadAction={() => console.log("DOWNLOAD")}
                makeActiveAction={() => console.log("MAKE ACTIVE")}
                saveAsDraftAction={() => console.log("SAVE AS DRAFT")}
                completionPercentage={20}
                optionalPercentage={0}
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
                                                    !schemaField.field.hidden
                                            )
                                            .filter(({ location }) =>
                                                location.startsWith(
                                                    selectedFormSection
                                                )
                                            )
                                            .map(fieldParent => {
                                                const { field } = fieldParent;

                                                return renderFormHydrationField(
                                                    field
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
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                                setSelectedFormSection(
                                    formSections[currentSectionIndex + 1]
                                )
                            }
                            disabled={isLastSection(
                                formSections,
                                currentSectionIndex
                            )}>
                            {t("skip")}
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
