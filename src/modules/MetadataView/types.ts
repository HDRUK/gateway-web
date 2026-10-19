import { ComponentType, ReactNode } from "react";
import { ResolvedSchemaNode } from "./utils/resolveSchemaNode";

export interface JSONSchemaNode {
    $ref?: string;
    anyOf?: JSONSchemaNode[];
    allOf?: JSONSchemaNode[];
    type?: string | string[];
    title?: string;
    description?: string;
    properties?: Record<string, JSONSchemaNode>;
    items?: JSONSchemaNode;
    enum?: unknown[];
    format?: string;
    [key: string]: unknown;
}

export interface JSONSchemaDocument {
    $defs?: Record<string, JSONSchemaNode>;
    properties?: Record<string, JSONSchemaNode>;
    [key: string]: unknown;
}

export type RenderStrategy =
    | "empty"
    | "text"
    | "date"
    | "link"
    | "tagList"
    | "textList"
    | "objectGrid"
    | "objectList"
    | "objectTable"
    | "nestedSection";

/**
 * Every renderer receives the raw value, the resolved schema node behind it,
 * and `renderDefault` so an override can decorate the built-in output rather
 * than having to reimplement it.
 */
export interface RendererProps {
    value: unknown;
    resolved: ResolvedSchemaNode;
    rootSchema: JSONSchemaDocument;
    depth: number;
    /**
     * The dotted path of this value from the document root, e.g.
     * "summary.keywords" - lets a consumer special-case particular fields
     * without the renderer knowing any field names. Array items share their
     * array's path. Undefined only when a caller does not supply one.
     */
    path?: string;
    /** The built-in output for this node, so an override can decorate it. */
    renderDefault: () => ReactNode;
    /**
     * Re-enters the render pipeline for a child node, so a custom layout can
     * still delegate each value back to the strategy renderers (including any
     * other overrides in the same map).
     */
    render: (
        resolved: ResolvedSchemaNode,
        value: unknown,
        depth: number,
        path?: string
    ) => ReactNode;
}

export type Renderer = ComponentType<RendererProps>;

export interface SectionProps {
    fieldKey: string;
    label: ReactNode;
    resolved: ResolvedSchemaNode;
    /** Whether the body is a labelled block or a single label/value pair. */
    isBlock: boolean;
    isLast: boolean;
    children: ReactNode;
}

export interface FieldLabelProps {
    fieldKey: string;
    label: string;
    resolved: ResolvedSchemaNode;
}

export interface ContainerProps {
    children: ReactNode;
}

/**
 * Mirrors MDX's `components` prop: anything supplied here replaces the
 * built-in renderer for that strategy. Omitted keys keep the default.
 */
export interface MetadataViewComponents
    extends Partial<Record<Exclude<RenderStrategy, "empty">, Renderer>> {
    Container?: ComponentType<ContainerProps>;
    Section?: ComponentType<SectionProps>;
    FieldLabel?: ComponentType<FieldLabelProps>;
}

export interface MetadataViewProps {
    data: Record<string, unknown>;
    /**
     * May be a whole schema document or any object node within one. When a
     * subtree is passed, supply `rootSchema` too so `$ref`s still resolve.
     */
    schema: JSONSchemaDocument | JSONSchemaNode;
    rootSchema?: JSONSchemaDocument;
    /**
     * Render one node of the metadata, e.g. "provenance" or
     * "summary.publisher", as a single titled section. Resolves the data and
     * the schema together, unwrapping `$ref`s at every hop - which
     * hand-passing `schema` cannot do beyond one level.
     */
    path?: string;
    /** Which children to render. Ignored when `path` is set: `path` is the selection. */
    include?: string[];
    /** Which children of the rendered node to leave out. */
    exclude?: string[];
    components?: MetadataViewComponents;
}

export type { ResolvedSchemaNode };
