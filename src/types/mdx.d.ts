declare module "*.mdx" {
    import type { Element, MDXProps } from "mdx/types";
    import type { TemplateMeta } from "@/templates/metadata/view/meta";

    export const meta: TemplateMeta | undefined;
    export default function MDXContent(props: MDXProps): Element;
}
