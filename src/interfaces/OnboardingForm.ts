import type { JSONSchemaDocument } from "@hdruk/gwdm-view";
import type { OnboardingSchema } from "@hdruk/metadata-onboard";

export interface OnboardingForm extends OnboardingSchema {
    schemas: OnboardingSchema[];
    default: OnboardingSchema;
    schema: JSONSchemaDocument;
    defaultValues: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface OnboardingFormQuery {
    model?: string;
    version?: string;
    datasetId?: string;
}

export interface OnboardingSaveResult {
    ok: boolean;
    datasetId?: number;
    errors?: string[];
}
