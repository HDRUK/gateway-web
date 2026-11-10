import { createTemplateRegistry } from "@hdruk/gwdm-view";
import { generatedTemplates } from "./registry.generated";

export type { GeneratedTemplate, TemplateMeta } from "@hdruk/gwdm-view";
export { DEFAULT_PARTNER } from "@hdruk/gwdm-view";

// Partners without a template of their own fall back to HDRUK's.
export const { getMetadataTemplate, listMetadataTemplates } =
    createTemplateRegistry(generatedTemplates);
