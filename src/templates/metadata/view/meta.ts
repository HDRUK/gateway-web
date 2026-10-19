import type { MDXComponents, MDXContent } from "mdx/types";

/** The folder name that matches any GWDM version for a partner. */
export const DEFAULT_VERSION = "default";

export interface TemplateMeta {
    description: string;
    /**
     * "production" lays the page out exactly as the existing dataset page -
     * its sections, labels, nav and anchors - via <ProductionSections />.
     * "schema" (the default) derives sections from the GWDM schema.
     */
    layout?: "production" | "schema";
    /**
     * Top-level GWDM sections, in the order the template renders them. The
     * page's section nav is built from this list - it sits in another column
     * of the same server tree, so it cannot observe what rendered. The
     * DatasetPageShell contract test fails if a listed section that has data
     * does not render, so keep it in step with the template's tags.
     */
    sections: string[];
}

export interface GeneratedTemplate {
    /** The partner context folder, e.g. "HDRUK" or "CRUK". */
    partner: string;
    /** A GWDM version folder, e.g. "2.1", or DEFAULT_VERSION. */
    version: string;
    source: string;
    /** Rendered with { data, schema, title, components }. */
    Template: MDXContent;
    meta: TemplateMeta;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeComponents?: (ctx: any) => MDXComponents;
}
