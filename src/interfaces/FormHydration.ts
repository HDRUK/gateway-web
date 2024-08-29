import { Option } from "./Option";

export interface FormHydrationField {
    component?: string;
    options?: Option[];
    checkboxes?: Option[];
    radios?: Option[];
    variant?: string;
    name: string;
    label?: string | null;
    limit?: number;
    required?: boolean;
    hidden?: boolean;
    placeholder?: string | null;
    showClearButton?: boolean;
    info?: string | null;
}

export interface FormHydrationItems {
    type: string;
    properties: FormHydrationField[];
}

export interface FormHydrationValidation {
    title: string;
    type: string;
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    format?: string;
    enum_titles?: string[];
    enum?: string[];
    of?: FormHydrationValidation;
    items?: FormHydrationItems;
}

interface FormHydration {
    title: string;
    description?: string | null;
    guidance?: string;
    is_array_form?: boolean;
    location?: string;
    field?: FormHydrationField;
    fields?: FormHydration[];
}

interface FormHydrationSchema {
    schema_fields: FormHydration[];
    validation: FormHydrationValidation[];
    defaultValues: {
        [key: string]: string | string[];
    };
}

export type { FormHydration, FormHydrationSchema };
