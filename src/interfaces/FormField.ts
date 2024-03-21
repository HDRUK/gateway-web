import { ComponentTypes } from "./ComponentTypes";

interface FormField {
    label: string;
    name: string;
    component: ComponentTypes;
    fields?: FormField[];
}

export type { FormField };
