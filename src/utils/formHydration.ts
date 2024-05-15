import {
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormTrigger,
} from "react-hook-form";
import { FormHydration } from "@/interfaces/FormHydration";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";

const formGetAllSectionFields = (
    schemaFields: FormHydration[],
    section: string
) =>
    schemaFields
        .filter(schemaField => !schemaField.field.hidden)
        .filter(({ location }) => location.startsWith(section));

const formSectionHasAllEmptyFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section).map(
        field => field.title
    );

    return getValues(allSectionFields).every(value => value === undefined);
};

const formSectionHasEmptyOptionalFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section);

    const optionalFields = allSectionFields
        .filter(schemaField => !schemaField.field.required)
        .map(field => field.title);

    return getValues(optionalFields).some(value => value === undefined);
};

const formGetSectionStatus = (
    isSectionActive: boolean,
    isSectionValid: boolean,
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>
) => {
    if (isSectionActive) {
        return LegendStatus.ACTIVE;
    }
    if (formSectionHasAllEmptyFields(schemaFields, section, getValues)) {
        return LegendStatus.UNTOUCHED;
    }
    if (!isSectionValid) {
        return LegendStatus.INVALID;
    }
    if (formSectionHasEmptyOptionalFields(schemaFields, section, getValues)) {
        return LegendStatus.OPTIONAL_REMAIN;
    }
    if (isSectionValid) {
        return LegendStatus.VALID;
    }
    return LegendStatus.INVALID;
};

const formValidateSection = async (
    schemaFields: FormHydration[],
    section: string,
    trigger: UseFormTrigger<FieldValues>
) => {
    const fields = schemaFields
        .filter(schemaField => !schemaField.field.hidden)
        .filter(({ location }) => location.startsWith(section))
        .map(field => field.title);

    return await trigger(fields, { shouldFocus: false });
};

const formIsSectionActive = (section: string, activeSectionName: string) =>
    section === activeSectionName;

const hasVisibleFieldsForLocation = (schema, location: string): boolean => {
    const fieldsForLocation = schema.schema_fields.filter(field =>
        field.location.startsWith(location)
    );

    return !fieldsForLocation.every(field => field.field.hidden);
};

const formGenerateLegendItems = async (
    formSections: string[],
    activeSectionName: string,
    shouldValidate: boolean,
    schemaFields: FormHydration[],
    clearErrors: UseFormClearErrors<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) => {
    const legendItems: LegendItem[] = await Promise.all(
        formSections.map(async section => {
            const sectionIsValid = shouldValidate
                ? await formValidateSection(schemaFields, section, trigger)
                : false;

            // Reset form error state
            clearErrors();

            // Get status of section
            const getSectionStatus = formGetSectionStatus(
                formIsSectionActive(section, activeSectionName),
                sectionIsValid,
                schemaFields,
                section,
                getValues
            );

            return {
                name: section,
                status: getSectionStatus,
            };
        })
    );

    return legendItems;
};

const isFirstSection = (currentSectionIndex: number) =>
    currentSectionIndex === 0;

const isLastSection = (formSections: string[], currentSectionIndex: number) =>
    formSections.length - 1 <= currentSectionIndex;

const getFirstLocationValues = schema => {
    const locationSet = new Set<string>(
        schema.schema_fields.map(({ location }) => location.split(".")[0])
    );

    return Array.from(locationSet);
};

export {
    formGetAllSectionFields,
    formGetSectionStatus,
    formSectionHasAllEmptyFields,
    formSectionHasEmptyOptionalFields,
    formGenerateLegendItems,
    formValidateSection,
    isLastSection,
    isFirstSection,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
};
