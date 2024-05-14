interface Option {
    label: string;
    value: string;
}

export interface FormHydrationField {
    component?: string;
    options?: Option[];
    variant?: string;
    name: string;
    label?: string;
    limit?: number;
    required?: boolean;
    hidden?: boolean;
    placeholder?: string;
    showClearButton?: boolean;
}

interface FormHydration {
    title: string;
    description?: string;
    guidance?: string;
    is_array_form: boolean;
    location: string;
    field: FormHydrationField;
    fields?: FormHydrationField[];
}

export type { FormHydration };
