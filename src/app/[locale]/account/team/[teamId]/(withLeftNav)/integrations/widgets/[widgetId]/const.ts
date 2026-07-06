export enum TabValues {
    CONFIGURATION = "configuration",
    PREVIEW = "preview",
}

export const DATA_CUSTODIAN_LIMIT = 25;

export const WIDGET_ID_CREATE = "create";

export const SIZE_PRESETS = [
    { labelKey: "sizeLarge", width: 600, height: 740 },
    { labelKey: "sizeMedium", width: 400, height: 592 },
    { labelKey: "sizeSmall", width: 300, height: 444 },
] as const;

export const BRANDING_DEFAULTS = {
    branding_primary: "#475DA7",
    branding_secondary: "#2C8267",
    branding_neutral: "#F6F7F8",
};

export const BRANDING_NHS = {
    branding_primary: "#005EB8",
    branding_secondary: "#007F3B",
    branding_neutral: "#F0F4F5",
};
