import { ReactNode } from "react";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";
import {
    ContainerProps,
    FieldLabelProps,
    MetadataViewComponents,
    RendererProps,
    SectionProps,
} from "../types";
import { labelFor } from "../utils/labelFor";
import {
    resolveSchemaNode,
    ResolvedSchemaNode,
} from "../utils/resolveSchemaNode";
import { sectionAnchorId } from "../utils/sectionAnchorId";
import FieldRows, { FieldRow } from "./FieldRows";
import ObjectTable from "./ObjectTable";
import ValueChips from "./ValueChips";

export const MAX_RECURSE_DEPTH = 6;

const SCROLL_MARGIN = 16;

export { labelFor };

const Mono = ({ children }: { children: ReactNode }) => (
    <Typography sx={{ fontFamily: "monospace" }}>{children}</Typography>
);

export const DefaultContainer = ({ children }: ContainerProps) => (
    <Paper sx={{ p: 2 }}>{children}</Paper>
);

export const DefaultFieldLabel = ({ label, resolved }: FieldLabelProps) =>
    resolved.description ? (
        <TooltipText content={resolved.description} label={label} />
    ) : (
        <>{label}</>
    );

/**
 * A heading means a container, a row means a label/value pair - nothing else
 * decides it. So a section holding an object, list or table gets the heading
 * and the rule beneath it, and a section holding a single value is laid out
 * as a field row like any other.
 *
 * The heading takes the bare label rather than the rendered <FieldLabel>:
 * TooltipText nests a body2 <p> inside, which would win over the heading's
 * own size and leave a section title looking like one of its field labels.
 */
export interface SectionBlockProps {
    fieldKey: string;
    heading: string;
    isLast?: boolean;
    children: ReactNode;
}

export const SectionBlock = ({
    fieldKey,
    heading,
    isLast = true,
    children,
}: SectionBlockProps) => (
    <Box
        id={sectionAnchorId(fieldKey)}
        sx={{
            scrollMarginTop: SCROLL_MARGIN,
            ...(!isLast && {
                borderBottom: 1,
                borderColor: "greyCustom.light",
            }),
            pl: 0,
            pr: 0,
        }}>
        <Typography variant="articleLead" component="h2" sx={{ mb: 2 }}>
            {heading}
        </Typography>
        {children}
    </Box>
);

export const DefaultSection = ({
    fieldKey,
    label,
    resolved,
    isBlock,
    isLast,
    children,
}: SectionProps) =>
    isBlock ? (
        <SectionBlock
            fieldKey={fieldKey}
            heading={labelFor(resolved, fieldKey)}
            isLast={isLast}>
            {children}
        </SectionBlock>
    ) : (
        // Anchored like a block so the section nav can still reach a section
        // that collapsed to one row.
        <Box
            id={sectionAnchorId(fieldKey)}
            sx={{ p: 0, scrollMarginTop: SCROLL_MARGIN }}>
            <FieldRow label={label}>{children}</FieldRow>
        </Box>
    );

const asText = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return Array.isArray(value) ? value.join(", ") : String(value);
};

const Text = ({ value }: RendererProps) => (
    <Typography>{asText(value)}</Typography>
);

const DateValue = ({ value }: RendererProps) => (
    <Typography>{formatDate(value as string)}</Typography>
);

const LinkValue = ({ value }: RendererProps) => (
    <Link href={value as string} target="_blank">
        {value as string}
    </Link>
);

export type RenderFn = (
    resolved: ResolvedSchemaNode,
    value: unknown,
    depth: number,
    path?: string
) => ReactNode;

const ObjectListRenderer = ({
    value,
    resolved,
    rootSchema,
    depth,
    path,
    render,
    renderDefault,
}: RendererProps) => {
    const itemsResolved = resolveSchemaNode(resolved.node.items, rootSchema);
    const items = value as Record<string, unknown>[];

    return (
        <BoxContainer sx={{ gap: 1, p: 0 }}>
            {items.map((item, index) => {
                const heading =
                    (typeof item?.name === "string" && item.name) ||
                    (typeof item?.title === "string" && item.title) ||
                    `Item ${index + 1}`;

                const rows = Object.keys(itemsResolved.node.properties ?? {})
                    .length ? (
                    <FieldRows
                        value={item}
                        resolved={itemsResolved}
                        rootSchema={rootSchema}
                        depth={depth}
                        path={path}
                        render={render}
                        renderDefault={renderDefault}
                    />
                ) : null;

                return (
                    <Accordion
                        key={`${heading}-${index}`}
                        heading={heading}
                        contents={rows ?? <Mono>{JSON.stringify(item)}</Mono>}
                    />
                );
            })}
        </BoxContainer>
    );
};

export const defaultRenderers: Required<
    Omit<MetadataViewComponents, "Container" | "Section" | "FieldLabel">
> = {
    text: Text,
    date: DateValue,
    link: LinkValue,
    tagList: ValueChips,
    textList: ValueChips,
    objectGrid: FieldRows,
    nestedSection: FieldRows,
    objectTable: ObjectTable,
    objectList: ObjectListRenderer,
};

export const DepthLimit = ({ value }: RendererProps) => (
    <Mono>{JSON.stringify(value)}</Mono>
);
