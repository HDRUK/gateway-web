interface Option {
    label: string;
    value: string;
}

interface FormHydration {
    title: string;
    guidance: string;
    field: {
        component: "TextArea" | "Select";
        options?: Option[];
        variant?: string;
        name?: string;
    };
}

export type { FormHydration };
