import { FieldValues, UseFormGetValues } from "react-hook-form";
import { FormHydration } from "@/interfaces/FormHydration";
import { LegendStatus } from "@/interfaces/FormLegend";

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

export {
    formGetAllSectionFields,
    formGetSectionStatus,
    formSectionHasAllEmptyFields,
    formSectionHasEmptyOptionalFields,
};
