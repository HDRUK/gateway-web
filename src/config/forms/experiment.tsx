import { ExperimentDefinition } from "@hdruk/experiments";
import * as yup from "yup";
import {
    AdminExperiment,
    ExperimentFormValues,
    ExperimentPayload,
} from "@/interfaces/Experiment";
import { ValueType } from "@/components/Autocomplete/Autocomplete";
import { SearchRoundedIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import { inputComponents } from ".";

const exitIntentInfo =
    "Shows when the pointer leaves through the top of the window, towards the tabs, address bar or close button. Never shows on phones or tablets, which have no pointer to track.";

const emptyDefinition = (): ExperimentDefinition => ({
    steps: [{ id: "step-1", blocks: [] }],
});

const defaultValues: ExperimentFormValues = {
    name: "",
    definition: emptyDefinition(),
    status: "draft",
    paths: [],
    audience: "all",
    user_ids: [],
    percentage: 100,
    trigger_on: "load",
    delay_seconds: 0,
    frequency: "untilAnswered",
    starts_at: null,
    ends_at: null,
};

const validationSchema = yup.object({
    name: yup.string().required().label("Name"),
    definition: yup.mixed<ExperimentDefinition>().required(),
    status: yup.string().required().label("Status"),
    paths: yup.array().of(yup.string()).min(1).label("Pages"),
    audience: yup.string().required().label("Audience"),
    user_ids: yup
        .array()
        .of(yup.number())
        .when("audience", {
            is: "user_ids",
            then: schema => schema.min(1),
        })
        .label("Users"),
    percentage: yup
        .number()
        .when("audience", {
            is: (audience: string) => audience !== "user_ids",
            then: schema =>
                schema
                    .typeError("Percentage must be a number")
                    .min(1)
                    .max(100)
                    .required(),
        })
        .label("Percentage"),
    trigger_on: yup.string().required().label("Show"),
    delay_seconds: yup
        .number()
        .typeError("Delay must be a number")
        .min(0)
        .label("Delay"),
    frequency: yup.string().required().label("Frequency"),
    starts_at: yup.string().nullable(),
    ends_at: yup.string().nullable(),
});

const settingsFields = [
    {
        label: "Name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
        info: "Only admins see this.",
    },
    {
        label: "Status",
        name: "status",
        component: inputComponents.Select,
        required: true,
        options: [
            { label: "Draft", value: "draft" },
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
            { label: "Archived", value: "archived" },
        ],
    },
    {
        label: "Starts",
        name: "starts_at",
        component: inputComponents.DatePicker,
    },
    {
        label: "Ends",
        name: "ends_at",
        component: inputComponents.DatePicker,
    },
];

const targetingFields = (
    audience: string,
    trigger: string,
    userOptions: { value: ValueType; label: string }[]
) => [
    {
        label: "Pages",
        name: "paths",
        component: inputComponents.Autocomplete,
        options: [],
        canCreate: true,
        multiple: true,
        required: true,
        info: "Paths to show the prompt on. Use `*` for one segment and `**` for any, e.g. `/en/account/team/*/datasets/create`",
    },
    {
        label: "Audience",
        name: "audience",
        component: inputComponents.Select,
        required: true,
        options: [
            { label: "Everyone", value: "all" },
            { label: "Signed-in users", value: "logged_in" },
            { label: "Signed-out visitors", value: "logged_out" },
            { label: "Specific users", value: "user_ids" },
        ],
    },
    ...(audience === "user_ids"
        ? [
              {
                  label: "Users",
                  name: "user_ids",
                  component: inputComponents.Autocomplete,
                  icon: SearchRoundedIcon,
                  noOptionsText: "No users found",
                  options: userOptions,
                  getChipLabel: (
                      options: { value: ValueType; label: string }[],
                      value: ValueType | { value: ValueType }
                  ) =>
                      options.find(
                          option =>
                              option.value ===
                              (typeof value === "object" ? value.value : value)
                      )?.label,
                  multiple: true,
                  required: true,
              },
          ]
        : []),
    ...(audience !== "user_ids"
        ? [
              {
                  label: "Percentage of audience",
                  name: "percentage",
                  component: inputComponents.TextField,
                  type: "number",
                  required: true,
                  info: "Each person is assigned once and keeps the same answer.",
              },
          ]
        : []),
    {
        label: "Show",
        name: "trigger_on",
        component: inputComponents.Select,
        required: true,
        ...(trigger === "exitIntent" && { info: exitIntentInfo }),
        options: [
            { label: "When the page loads", value: "load" },
            { label: "After a delay", value: "delay" },
            {
                label: "When they are about to leave (desktop only)",
                value: "exitIntent",
            },
        ],
    },
    ...(trigger === "delay"
        ? [
              {
                  label: "Delay (seconds)",
                  name: "delay_seconds",
                  component: inputComponents.TextField,
                  type: "number",
              },
          ]
        : []),
    {
        label: "Frequency",
        name: "frequency",
        component: inputComponents.Select,
        required: true,
        options: [
            { label: "Until answered", value: "untilAnswered" },
            { label: "Once only", value: "once" },
            { label: "Every visit", value: "always" },
        ],
    },
];

const toFormValues = (experiment: AdminExperiment): ExperimentFormValues => ({
    name: experiment.name,
    definition: experiment.definition,
    status: experiment.status,
    paths: experiment.targeting.paths,
    audience: experiment.targeting.audience,
    user_ids: experiment.targeting.user_ids ?? [],
    percentage: experiment.targeting.percentage,
    trigger_on: experiment.trigger.on,
    delay_seconds: experiment.trigger.delaySeconds ?? 0,
    frequency: experiment.trigger.frequency,
    starts_at: experiment.starts_at,
    ends_at: experiment.ends_at,
});

const toPayload = (values: ExperimentFormValues): ExperimentPayload => ({
    name: values.name,
    status: values.status,
    definition: values.definition,
    targeting: {
        paths: values.paths,
        audience: values.audience,
        ...(values.audience === "user_ids" && {
            user_ids: values.user_ids.map(Number),
        }),
        percentage:
            values.audience === "user_ids" ? 100 : Number(values.percentage),
    },
    trigger: {
        on: values.trigger_on,
        ...(values.trigger_on === "delay" && {
            delaySeconds: Number(values.delay_seconds),
        }),
        frequency: values.frequency,
    },
    starts_at: values.starts_at
        ? formatDate(values.starts_at, "YYYY-MM-DD") ?? null
        : null,
    ends_at: values.ends_at
        ? formatDate(values.ends_at, "YYYY-MM-DD") ?? null
        : null,
});

export {
    defaultValues as experimentDefaultValues,
    validationSchema as experimentValidationSchema,
    settingsFields as experimentSettingsFields,
    targetingFields as experimentTargetingFields,
    toFormValues as experimentToFormValues,
    toPayload as experimentToPayload,
};
