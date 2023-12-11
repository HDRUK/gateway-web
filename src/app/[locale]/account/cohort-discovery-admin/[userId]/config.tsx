import * as yup from "yup";
import { inputComponents } from "@/config/forms";

const cohortStatusOptions = [
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
};

export const requestStatusField = {
    label: "Status",
    name: "request_status",
    component: inputComponents.Select,
    options: cohortStatusOptions,
    placeholder: "Select a new status",
};

export const detailsField = {
    label: "Why did you make this action?",
    name: "details",
    extraInfo: "Minimum 30 characters",
    component: inputComponents.TextArea,
    required: true,
};
