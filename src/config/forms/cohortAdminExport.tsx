import dayjs from "dayjs";
import { CohortRequestStatus } from "@/interfaces/CohortRequest";
import { capitalise } from "@/utils/general";
import { inputComponents } from ".";

const cohortRequestStatusValues: (CohortRequestStatus | "NULL")[] = [
    "NULL",
    "APPROVED",
    "REJECTED",
    "PENDING",
    "BANNED",
    "SUSPENDED",
    "EXPIRED",
];

const defaultValues = {
    dateRangeFrom: dayjs(new Date("2020-01-01")),
    dateRangeTo: dayjs(new Date()),
    organisations: [],
    status: {
        NULL: false,
        APPROVED: false,
        REJECTED: false,
        PENDING: false,
        BANNED: false,
        SUSPENDED: false,
        EXPIRED: false,
    },
};

const formFields = [
    {
        label: "Date range",
        name: "dateRange",
        fields: [
            {
                label: "From:",
                name: "dateRangeFrom",
                component: inputComponents.DatePicker,
                required: true,
            },
            {
                label: "To:",
                name: "dateRangeTo",
                component: inputComponents.DatePicker,
                required: true,
            },
        ],
    },
    {
        label: "Cohort Status",
        name: "status",
        nColumns: 3,
        formControlSx: { m: 0, p: 0, mb: 0 },
        component: inputComponents.CheckboxGroup,
        checkboxes: cohortRequestStatusValues.map(status => ({
            name: `status.${status}`,
            label: capitalise(status),
        })),
    },
    {
        label: "Organisation(s)",
        name: "organisations",
        component: inputComponents.Autocomplete,
        required: false,
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        multiple: true,
        canCreate: false,
    },
];

export {
    defaultValues as cohortExportDefaultValues,
    formFields as cohortExportFormFields,
    cohortRequestStatusValues,
};
