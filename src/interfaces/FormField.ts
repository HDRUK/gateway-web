import { ComponentTypes } from "./ComponentTypes";

interface FormField<TName> {
    label: string;
    name: TName;
    component: ComponentTypes;
    fields?: FormField<TName>[];
    guidance?: string;
}

export type { FormField };
