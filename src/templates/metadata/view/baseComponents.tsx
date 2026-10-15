import { ComponentType, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";
import type { MDXComponents } from "mdx/types";
import { Dataset, VersionItem } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import MetadataView, {
    JSONSchemaDocument,
    MetadataViewProps,
} from "@/modules/MetadataView";
import { DatasetSection as DatasetSectionConfig } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";
import {
    areaSx,
    backSx,
    layoutSx,
    leftColumnSx,
    mainColumnSx,
    navSx,
    titleSx,
} from "@/app/[locale]/(logged-out)/dataset/[datasetId]/page.styles";
import DatasetSection from "./components/DatasetSection";
import FieldStrip from "./components/FieldStrip";
import Prose from "./components/Prose";
import SectionNav from "./components/SectionNav";

export interface MetadataViewContext {
    data: Record<string, unknown>;
    schema: JSONSchemaDocument;
    title?: string;
    dataCustodianName?: string;
    dataset: Dataset;
    datasetVersion: VersionItem;
    datasetStats: Partial<VersionItem>;
    populatedSections: DatasetSectionConfig[];
    linkageCounts: Record<string, number>;
}

/**
 * The tags every template can use, declared as a type alias rather than an
 * interface so it carries the implicit index signature MDXComponents needs.
 * A template narrows `S` to its own schema's section keys, which is how an
 * .mdx gets `name="summry"` flagged.
 */
export type BaseVocabulary<S extends string = string> = {
    Article: ComponentType<{ children?: ReactNode }>;
    DatasetLayout: ComponentType<{ children?: ReactNode }>;
    Column: ComponentType<{ name: "left" | "main"; children?: ReactNode }>;
    Region: ComponentType<{ area: string; children?: ReactNode }>;
    MetadataView: ComponentType<Partial<MetadataViewProps>>;
    DatasetSection: ComponentType<{
        name?: S;
        exclude?: string[];
        fields?: boolean;
        children?: ReactNode;
    }>;
    FieldStrip: ComponentType<{ fields: S[] }>;
    Prose: ComponentType<{ field: string }>;
    SectionNav: ComponentType<{ sections: S[]; sx?: SxProps<Theme> }>;
};

export type MakeComponents = (ctx: MetadataViewContext) => MDXComponents;

const AREA_STYLES: Record<string, SxProps<Theme>> = {
    back: backSx,
    title: titleSx,
};

export const makeBaseComponents = <S extends string = string>(
    ctx: MetadataViewContext
): BaseVocabulary<S> => ({
    Article: ({ children }) => (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>{children}</Box>
    ),

    DatasetLayout: ({ children }) => (
        <BoxContainer sx={layoutSx}>{children}</BoxContainer>
    ),

    Column: ({ name, children }) => (
        <Box sx={name === "left" ? leftColumnSx : mainColumnSx}>{children}</Box>
    ),

    Region: ({ area, children }) => (
        <Box sx={AREA_STYLES[area] ?? areaSx(area)}>{children}</Box>
    ),

    // data/schema default to the whole dataset, but a template can pass either
    // explicitly - e.g. path="provenance". rootSchema stays pinned to the full
    // document so $refs inside a subtree still resolve.
    MetadataView: props => (
        <MetadataView
            data={ctx.data}
            schema={ctx.schema}
            rootSchema={ctx.schema}
            {...props}
        />
    ),

    DatasetSection: props => (
        <DatasetSection {...props} data={ctx.data} schema={ctx.schema} />
    ),

    // data last for DatasetSection, which resolves `name` against the root;
    // data first for the rest, so <DatasetSection>'s injected section data wins.
    FieldStrip: props => (
        <FieldStrip data={ctx.data} schema={ctx.schema} {...props} />
    ),

    Prose: props => <Prose data={ctx.data} {...props} />,

    SectionNav: props => (
        <SectionNav data={ctx.data} schema={ctx.schema} sx={navSx} {...props} />
    ),
});
