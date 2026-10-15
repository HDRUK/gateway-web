import { ComponentType } from "react";
import { MakeComponents } from "./baseComponents";

export interface TemplateMeta {
    description: string;
}

export interface MetadataTemplateProps {
    title?: string;
    data: Record<string, unknown>;
    schema: Record<string, unknown>;
    [key: string]: unknown;
}

export interface GeneratedTemplate {
    schemaName: string;
    schemaVersion: string;
    source: string;
    Template: ComponentType<MetadataTemplateProps>;
    meta?: TemplateMeta;
    makeComponents?: MakeComponents;
}

export interface ResolvedTemplate {
    source: string;
    Template: ComponentType<MetadataTemplateProps>;
    meta?: TemplateMeta;
    makeComponents: MakeComponents;
}

export const DEFAULT_VERSION = "default";
