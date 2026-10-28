import { ComponentType, Fragment } from "react";
import {
    isEmptyValue,
    labelFor,
    MetadataViewComponents,
    RendererProps,
    resolveSchemaNode,
    sectionAnchorId,
    SectionProps,
    tableColumnKeys,
} from "@hdruk/gwdm-view";
import { uniq } from "lodash";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import TooltipText from "@/components/TooltipText";
import Typography from "@/components/Typography";
import {
    escapeMarkdownUnderscores,
    formatTextWithLinks,
    splitStringList,
} from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import { DuoCodeDetails } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/_gwdm/lib/duoCodeDetails";
import DuoCodeChips from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetContent/DuoCodeChips";
import GatewayTable from "./GatewayTable";
import SearchTags from "./SearchTags";

/**
 * Renders metadata values exactly as the production dataset page's
 * DatasetContent does, so the GWDM page is indistinguishable from it. Kept
 * here rather than in MetadataView, which stays brand-neutral.
 */

const DATE_FORMAT = "DD/MM/YYYY";
const DOI_URL = "https://doi.org/";

/** Production LIST_TAG fields: each value links to a dataset search. */
export const SEARCH_TAG_PATHS = ["summary.keywords", "summary.datasetAliases"];
const DOI_PATH = "summary.doiName";
/** GA4GH DUO codes (GWDM 2.2+), rendered as production's labelled chips. */
export const DUO_CODES_PATH = "accessibility.usage.duoCodes";
// GWDM 2.0 spells it followup, 2.1+ followUp.
const FOLLOWUP_PATHS = ["coverage.followUp", "coverage.followup"];

export const toList = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter(item => !isEmptyValue(item)).map(String)
        : uniq(splitStringList(String(value))).filter(Boolean);

const isSearchTag = (path?: string) =>
    !!path && SEARCH_TAG_PATHS.includes(path);

/** Production TEXT: sanitised markdown, with the page's path-specific fixes. */
export const GatewayText = ({ value, path }: RendererProps) => {
    if (isSearchTag(path)) return <SearchTags tags={toList(value)} />;

    let text =
        typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

    if (path === DOI_PATH && !text.startsWith("http")) text = DOI_URL + text;
    // Markdown would read a leading '>' as a blockquote.
    if (path && FOLLOWUP_PATHS.includes(path)) text = text.replace(/>/g, "`>`");

    return (
        <MarkDownSanitizedWithHtml
            content={escapeMarkdownUnderscores(text)}
            wrapper="span"
        />
    );
};

/** Production LIST_TEXT: comma-separated, links made clickable. */
export const GatewayList = ({ value, path }: RendererProps) => {
    const items = toList(value);
    if (!items.length) return null;
    if (isSearchTag(path)) return <SearchTags tags={items} />;

    return (
        <span>
            {items.map((item, i) => [i > 0 && ", ", formatTextWithLinks(item)])}
        </span>
    );
};

export const GatewayDate = ({ value }: RendererProps) => (
    <Typography>{formatDate(value as string, DATE_FORMAT)}</Typography>
);

const columnHeader = (label: string, description?: string) =>
    description ? (
        <TooltipText content={description} placement="bottom" label={label} />
    ) : (
        label
    );

/** Tables use the production observations table. */
const GatewayObjectTable = (props: RendererProps) => {
    const { value, resolved, rootSchema, depth, path, render } = props;
    const rows = (value ?? []) as Record<string, unknown>[];
    const keys = tableColumnKeys(resolved, value, rootSchema);
    if (!keys.length) return null;

    // One populated column is a list, as in the generic renderer.
    if (keys.length === 1) {
        const [only] = keys;
        return (
            <GatewayList
                {...props}
                value={rows.map(row => row[only]).filter(v => !isEmptyValue(v))}
            />
        );
    }

    const itemProperties =
        resolveSchemaNode(resolved.node.items, rootSchema).node.properties ??
        {};
    const columns = keys.map(key => {
        const column = resolveSchemaNode(itemProperties[key], rootSchema);
        return {
            key,
            resolved: column,
            header: columnHeader(labelFor(column, key), column.description),
        };
    });

    return (
        <GatewayTable
            columns={columns.map(({ key, header }) => ({ key, header }))}
            rows={rows.map(row =>
                Object.fromEntries(
                    columns.map(column => [
                        column.key,
                        render(
                            column.resolved,
                            row[column.key],
                            depth + 1,
                            path ? `${path}.${column.key}` : column.key
                        ) ?? "-",
                    ])
                )
            )}
        />
    );
};

/** The page supplies one card around every section, as production does. */
const GatewayContainer = Fragment;

/**
 * Production's section block: articleLead heading over a rule, the rule
 * drawn between sections (not under the last) by `:not(:last-of-type)`, so
 * it works across the separate views a template's tags produce.
 */
const GatewaySection = ({
    fieldKey,
    label,
    resolved,
    isBlock,
    children,
}: SectionProps) =>
    isBlock ? (
        <Box
            id={sectionAnchorId(fieldKey)}
            sx={{
                "&:not(:last-of-type)": {
                    borderBottom: 1,
                    borderColor: "greyCustom.light",
                },
                pl: 0,
                pr: 0,
            }}>
            <Typography
                variant="articleLead"
                component="h2"
                sx={{ mb: 2 }}
                aria-live="polite"
                tabIndex={-1}>
                {labelFor(resolved, fieldKey)}
            </Typography>
            {children}
        </Box>
    ) : (
        <BoxContainer
            id={sectionAnchorId(fieldKey)}
            sx={{
                gridTemplateColumns: { lg: "repeat(3, 1fr)" },
                gap: 1,
                "&:not(:last-of-type)": { mb: 2 },
            }}>
            <Box sx={{ gridColumn: { lg: "span 1" }, p: 0 }}>{label}</Box>
            <Box
                sx={{
                    gridColumn: { lg: "span 2" },
                    p: 0,
                    wordWrap: "break-word",
                }}>
                {children}
            </Box>
        </BoxContainer>
    );

export interface GatewayComponentOptions {
    /**
     * DUO code labels from the HDRUK schema. GWDM stores the codes but not
     * their labels; without these, codes show as-is.
     */
    duoCodeDetails?: Record<string, DuoCodeDetails>;
}

/**
 * The renderer overrides for a page. A factory because DUO chips need labels
 * fetched per request; everything else is static.
 */
export const makeGatewayComponents = ({
    duoCodeDetails = {},
}: GatewayComponentOptions = {}): MetadataViewComponents => {
    const withDuoCodes =
        (Renderer: ComponentType<RendererProps>) => (props: RendererProps) =>
            props.path === DUO_CODES_PATH ? (
                <DuoCodeChips
                    codes={toList(props.value)}
                    details={duoCodeDetails}
                />
            ) : (
                <Renderer {...props} />
            );

    return {
        text: withDuoCodes(GatewayText),
        link: GatewayText,
        date: GatewayDate,
        tagList: withDuoCodes(GatewayList),
        textList: withDuoCodes(GatewayList),
        objectTable: GatewayObjectTable,
        Container: GatewayContainer,
        Section: GatewaySection,
    };
};

export const gatewayComponents = makeGatewayComponents();
