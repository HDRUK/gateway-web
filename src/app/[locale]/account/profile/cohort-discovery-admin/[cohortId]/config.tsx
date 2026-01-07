import * as yup from "yup";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { inputComponents } from "@/config/forms";

const cohortStatusOptions = [
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Banned", value: "BANNED" },
    { label: "Suspended", value: "SUSPENDED" },
];

const nhseSdeCohortStatusOptions = [
    { label: "In Process", value: "IN PROCESS" }, // This means that the user has clicked on the SDE link
    { label: "Approval Requested", value: "APPROVAL REQUESTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Banned", value: "BANNED" },
    { label: "Suspended", value: "SUSPENDED" },
];

export const validationSchema = yup.object({
    details: yup.string().required().min(30),
});

export const defaultValues = {
    request_status: "",
    details: "",
    nhse_sde_request_status: "",
};

export const requestStatusField = {
    label: "Cohort Status",
    name: "request_status",
    component: inputComponents.Select,
    options: cohortStatusOptions,
    placeholder: "Select a new status",
};

export const workgroupField = {
    label: "Workgroups",
    name: "workgroup_ids",
    component: inputComponents.Autocomplete,
    multiple: true,
    canCreate: false,
    isOptionEqualToValue: (
        option: { value: string | number; label: string },
        value: string | number
    ) => option.value === value,
    getChipLabel,
    options: [],
    placeholder: "Select workgroup",
};

export const detailsField = {
    label: "Why did you make this action?",
    name: "details",
    extraInfo: "Minimum 30 characters",
    component: inputComponents.TextArea,
    required: true,
};

export const nhseSdeRequestStatusField = {
    label: "NHSE SDE Status",
    name: "nhse_sde_request_status",
    component: inputComponents.Select,
    options: nhseSdeCohortStatusOptions,
    placeholder: "Select a new status",
};
