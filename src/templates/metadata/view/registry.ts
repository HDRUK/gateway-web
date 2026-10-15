import Default from "./Default.mdx";
import { makeBaseComponents } from "./baseComponents";
import { DEFAULT_VERSION, GeneratedTemplate, ResolvedTemplate } from "./meta";
import { generatedTemplates } from "./registry.generated";

export type { MetadataTemplateProps, ResolvedTemplate } from "./meta";

const resolve = (entry: GeneratedTemplate): ResolvedTemplate => ({
    source: entry.source,
    Template: entry.Template,
    meta: entry.meta,
    makeComponents: entry.makeComponents ?? makeBaseComponents,
});

const DEFAULT_TEMPLATE: ResolvedTemplate = {
    source: "Default.mdx",
    Template: Default,
    makeComponents: makeBaseComponents,
};

const find = (schemaName: string, schemaVersion: string) =>
    generatedTemplates.find(
        entry =>
            entry.schemaName === schemaName &&
            entry.schemaVersion === schemaVersion
    );

export function getMetadataTemplate(
    schemaName: string,
    schemaVersion: string
): ResolvedTemplate {
    const match =
        find(schemaName, schemaVersion) ?? find(schemaName, DEFAULT_VERSION);

    return match ? resolve(match) : DEFAULT_TEMPLATE;
}

export const listMetadataTemplates = (): GeneratedTemplate[] =>
    generatedTemplates;
