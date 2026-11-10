import { ComponentType } from "react";
import {
    BaseVocabulary as PackageVocabulary,
    makeBaseComponents as makePackageComponents,
    MarkdownProps,
    MetadataViewContext as PackageContext,
} from "@hdruk/gwdm-view";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import { escapeMarkdownUnderscores } from "@/utils/dataset";
import { DuoCodeDetails } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/_gwdm/lib/duoCodeDetails";
import { makeGatewayComponents } from "./gateway/gatewayComponents";
import { GATEWAY_SECTIONS } from "./gateway/gatewaySections";
import ProductionSections from "./production/ProductionSections";

export interface MetadataViewContext extends PackageContext {
    /** DUO code labels from the HDRUK schema; codes show as-is without. */
    duoCodeDetails?: Record<string, DuoCodeDetails>;
}

/**
 * The tags every template can use: @hdruk/gwdm-view's vocabulary, plus the
 * Gateway's production layout. A template narrows `S` to its GWDM version's
 * section keys, which is how an .mdx gets `name="summry"` flagged.
 *
 * Deliberately content only: the page layout, title, actions and other
 * Gateway chrome belong to DatasetPageShell, so no template can drop them.
 */
export type BaseVocabulary<S extends string = string> = PackageVocabulary<S> & {
    /** The existing dataset page's sections, from GWDM. Takes no props. */
    ProductionSections: ComponentType;
};

export type MakeComponents = (ctx: MetadataViewContext) => BaseVocabulary;

/** <Prose> text as the production page shows it: sanitised markdown. */
const GatewayMarkdown = ({ content }: MarkdownProps) => (
    <MarkDownSanitizedWithHtml
        content={escapeMarkdownUnderscores(content)}
        wrapper="span"
    />
);

/**
 * Values render with the production page's components (gatewayComponents),
 * so every template looks and behaves like the existing dataset page.
 */
export const makeBaseComponents = <S extends string = string>(
    ctx: MetadataViewContext
): BaseVocabulary<S> => ({
    ...makePackageComponents<S>(ctx, {
        components: makeGatewayComponents({
            duoCodeDetails: ctx.duoCodeDetails,
        }),
        specialSections: GATEWAY_SECTIONS,
        Markdown: GatewayMarkdown,
    }),

    ProductionSections: () => (
        <ProductionSections
            data={ctx.data}
            duoCodeDetails={ctx.duoCodeDetails}
        />
    ),
});
