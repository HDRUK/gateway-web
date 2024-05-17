interface Option {
    label: string;
    value: string;
}

export interface FormHydrationField {
    component?: string;
    options?: Option[];
    variant?: string;
    name: string;
    label?: string | null;
    limit?: number;
    required?: boolean;
    hidden?: boolean;
    placeholder?: string | null;
    showClearButton?: boolean;
}

interface FormHydration {
    title: string;
    description?: string | null;
    guidance?: string;
    is_array_form: boolean;
    location: string;
    field: FormHydrationField;
    validation: unknown;
}

export type { FormHydration };
