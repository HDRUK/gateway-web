import { capitalise } from "@/utils/general";
import { CohortRequestStatus } from "@/interfaces/CohortRequest";
import dayjs from "dayjs";
import { inputComponents } from ".";

const cohortRequestStatusValues: CohortRequestStatus[] = [
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
        label: "Status",
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
        label: "Organisations(s)",
        name: "organisations",
        component: inputComponents.Autocomplete,
        freeSolo: true, // note: may want this to be false and hydrate the fields with organisation names at a later point?
        required: false,
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        multiple: true,
        canCreate: true,
    },
];

export {
    defaultValues as cohortExportDefaultValues,
    formFields as cohortExportFormFields,
    cohortRequestStatusValues,
};
