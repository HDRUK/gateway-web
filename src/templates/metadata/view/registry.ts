import { GeneratedTemplate } from "./meta";
import { generatedTemplates } from "./registry.generated";
import { resolveTemplate, TemplateQuery } from "./resolveTemplate";

export type { GeneratedTemplate, TemplateMeta } from "./meta";
export { DEFAULT_PARTNER } from "./resolveTemplate";

export const getMetadataTemplate = (query: TemplateQuery): GeneratedTemplate =>
    resolveTemplate(generatedTemplates, query);

export const listMetadataTemplates = (): GeneratedTemplate[] =>
    generatedTemplates;
