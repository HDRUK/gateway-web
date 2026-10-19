import { ComponentType, ReactNode } from "react";
import MetadataView, {
    JSONSchemaDocument,
    MetadataViewProps,
} from "@/modules/MetadataView";
import { DuoCodeDetails } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/_gwdm/lib/duoCodeDetails";
import DatasetSection from "./components/DatasetSection";
import FieldStrip from "./components/FieldStrip";
import Prose from "./components/Prose";
import { makeGatewayComponents } from "./gateway/gatewayComponents";
import { GATEWAY_SECTIONS } from "./gateway/gatewaySections";
import ProductionSections from "./production/ProductionSections";

export interface MetadataViewContext {
    /** The dataset's native GWDM metadata. */
    data: Record<string, unknown>;
    /** The GWDM JSON Schema for the dataset's version, from TRASER. */
    schema: JSONSchemaDocument;
    /** DUO code labels from the HDRUK schema; codes show as-is without. */
    duoCodeDetails?: Record<string, DuoCodeDetails>;
}

/**
 * The tags every template can use. A template narrows `S` to its GWDM
 * version's section keys, which is how an .mdx gets `name="summry"` flagged.
 *
 * Deliberately content only: the page layout, title, actions and other
 * Gateway chrome belong to DatasetPageShell, so no template can drop them.
 * Values render with the production page's components (gatewayComponents),
 * so every template looks and behaves like the existing dataset page.
 * Declared as a type alias so it carries the index signature MDXComponents
 * needs.
 */
export type BaseVocabulary<S extends string = string> = {
    MetadataView: ComponentType<Partial<MetadataViewProps>>;
    DatasetSection: ComponentType<{
        name?: S;
        exclude?: string[];
        fields?: boolean;
        children?: ReactNode;
    }>;
    FieldStrip: ComponentType<{ fields: string[]; path?: S }>;
    Prose: ComponentType<{ field: string }>;
    /** The existing dataset page's sections, from GWDM. Takes no props. */
    ProductionSections: ComponentType;
};

export type MakeComponents = (ctx: MetadataViewContext) => BaseVocabulary;

export const makeBaseComponents = <S extends string = string>(
    ctx: MetadataViewContext
): BaseVocabulary<S> => {
    const gatewayComponents = makeGatewayComponents({
        duoCodeDetails: ctx.duoCodeDetails,
    });

    return {
        // data/schema default to the whole dataset; a template can still pass
        // `path` or explicit data. rootSchema stays pinned to the full document so
        // $refs inside a subtree resolve.
        MetadataView: ({ components, ...props }) => (
            <MetadataView
                data={ctx.data}
                schema={ctx.schema}
                rootSchema={ctx.schema}
                {...props}
                components={{ ...gatewayComponents, ...components }}
            />
        ),

        DatasetSection: props => (
            <DatasetSection
                {...props}
                data={ctx.data}
                schema={ctx.schema}
                components={gatewayComponents}
                specialSections={GATEWAY_SECTIONS}
            />
        ),

        FieldStrip: props => (
            <FieldStrip
                data={ctx.data}
                schema={ctx.schema}
                components={gatewayComponents}
                {...props}
            />
        ),

        // data first, so a <DatasetSection>'s injected section data wins.
        Prose: props => <Prose data={ctx.data} {...props} />,

        ProductionSections: () => (
            <ProductionSections
                data={ctx.data}
                duoCodeDetails={ctx.duoCodeDetails}
            />
        ),
    };
};
