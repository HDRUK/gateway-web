import { inputComponents } from ".";
import { capitalise } from "@/utils/general";
import { CohortRequestStatus } from "@/interfaces/CohortRequest";
import dayjs from "dayjs";

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
    status_APPROVED: false,
    status_REJECTED: false,
    status_PENDING: false,
    status_BANNED: false,
    status_SUSPENDED: false,
    status_EXPIRED: false,
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
        component: inputComponents.CheckboxGroup,
        checkboxes: cohortRequestStatusValues.map(status => ({
            name: `status_${status}`,
            label: capitalise(status),
        })),
    },
    {
        label: "Organisations(s)",
        name: "organisations",
        component: inputComponents.Autocomplete,
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
