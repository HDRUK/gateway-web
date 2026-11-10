declare module "*.mdx" {
    import type { Element, MDXProps } from "mdx/types";
    import type { TemplateMeta } from "@hdruk/gwdm-view";

    // Required: DatasetPageShell builds the section nav from meta.sections.
    export const meta: TemplateMeta;
    export default function MDXContent(props: MDXProps): Element;
}
