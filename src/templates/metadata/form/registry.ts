import { createTemplateRegistry } from "@hdruk/gwdm-view";
import type { FormTemplateMeta } from "@hdruk/metadata-onboard";
import { generatedTemplates } from "./registry.generated";

export const FALLBACK_TEMPLATE = "GENERIC";

export const {
    getMetadataTemplate: getFormTemplate,
    listMetadataTemplates: listFormTemplates,
} = createTemplateRegistry(generatedTemplates, {
    fallbackPartner: FALLBACK_TEMPLATE,
});

const DEFAULT_META: Partial<FormTemplateMeta> = {
    system: ["identifier", "version", "revisions", "issued", "modified"],
    clearOnDuplicate: ["summary.title"],
};

export const formTemplateMeta = (meta: unknown): FormTemplateMeta => ({
    ...DEFAULT_META,
    ...(meta as FormTemplateMeta),
});
