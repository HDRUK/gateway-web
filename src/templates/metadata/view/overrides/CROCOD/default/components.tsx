import { ComponentType, Fragment } from "react";
import Box from "@/components/Box";
import BulletList from "@/components/BulletList";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Typography from "@/components/Typography";
import MetadataView, {
    isEmptyValue,
    labelFor,
    MetadataViewComponents,
    RendererProps,
    resolveAtPath,
    resolveSchemaNode,
    valueHasContent,
} from "@/modules/MetadataView";
import { escapeMarkdownUnderscores } from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import {
    BaseVocabulary,
    makeBaseComponents,
    MetadataViewContext,
} from "../../../baseComponents";
import { StripCell, StripContainer } from "../../../components/FieldStrip";
import {
    makeGatewayComponents,
    toList,
} from "../../../gateway/gatewayComponents";

/** The case study's paths these renderers recognise. */
export const LEARNINGS_PATH = "crocod.learnings";
export const READ_MORE_PATH = "crocod.readMore";

export type CaseStudyVocabulary = BaseVocabulary & {
    /**
     * Fields from anywhere in the record, by dotted path, as one strip.
     * Dates show as years - a case study records the trial's years.
     */
    TrialFacts: ComponentType<{ fields: string[] }>;
};

interface Learning {
    summary?: string | null;
    tags?: string[] | null;
    content?: string | null;
}

const Html = ({ content }: { content: string }) => (
    <MarkDownSanitizedWithHtml content={escapeMarkdownUnderscores(content)} />
);

const GatewayYear = ({ value }: RendererProps) => (
    <Typography>{formatDate(value as string, "YYYY")}</Typography>
);

/**
 * Each learnings area as the case study shows it: the area's heading, its
 * summary as a subheading, its tags as ticks and its content as sanitised
 * HTML. Areas with nothing to show are skipped; free-text fields (additional
 * insights) render as a heading over HTML.
 */
const LearningsBody = ({ value, resolved, rootSchema }: RendererProps) => {
    const learnings = (value ?? {}) as Record<string, unknown>;
    const properties = resolved.node.properties ?? {};

    return (
        <Box sx={{ p: 0 }}>
            {Object.keys(properties).map(key => {
                const area = learnings[key];
                const areaResolved = resolveSchemaNode(
                    properties[key],
                    rootSchema,
                    area
                );
                if (!valueHasContent(areaResolved, area, rootSchema)) {
                    return null;
                }

                const heading = (
                    <Typography variant="h3" component="h3">
                        {labelFor(areaResolved, key)}
                    </Typography>
                );

                if (typeof area === "string") {
                    return (
                        <Box key={key} sx={{ p: 0, mb: 2 }}>
                            {heading}
                            <Html content={area} />
                        </Box>
                    );
                }

                const { summary, tags, content } = area as Learning;

                return (
                    <Box key={key} sx={{ p: 0, mb: 2 }}>
                        {heading}
                        {summary && (
                            <Typography variant="h4" component="h4">
                                {summary}
                            </Typography>
                        )}
                        {!isEmptyValue(tags) && (
                            <BulletList
                                items={toList(tags).map(label => ({ label }))}
                            />
                        )}
                        {content && <Html content={content} />}
                    </Box>
                );
            })}
        </Box>
    );
};

/** Read-more entries are HTML (usually links), so each is sanitised HTML. */
const HtmlList = ({ value }: RendererProps) => (
    <ul style={{ margin: 0, paddingLeft: 16 }}>
        {toList(value).map(item => (
            <li key={item}>
                <MarkDownSanitizedWithHtml
                    content={escapeMarkdownUnderscores(item)}
                    wrapper="span"
                />
            </li>
        ))}
    </ul>
);

export const makeComponents = (
    ctx: MetadataViewContext
): CaseStudyVocabulary => {
    const base = makeBaseComponents(ctx);
    const gateway = makeGatewayComponents({
        duoCodeDetails: ctx.duoCodeDetails,
    });

    // Path-aware, so every other field keeps the Gateway rendering.
    const caseStudyComponents: MetadataViewComponents = {
        nestedSection: props =>
            props.path === LEARNINGS_PATH ? (
                <LearningsBody {...props} />
            ) : (
                <>{props.renderDefault()}</>
            ),
        textList: props => {
            const GatewayTextList = gateway.textList as ComponentType<
                typeof props
            >;
            return props.path === READ_MORE_PATH ? (
                <HtmlList {...props} />
            ) : (
                <GatewayTextList {...props} />
            );
        },
    };

    const TrialFacts = ({ fields }: { fields: string[] }) => {
        const cells = fields.flatMap(fieldPath => {
            const segments = fieldPath.split(".");
            const key = segments.pop() as string;
            const parent = segments.join(".");
            const scoped = parent
                ? resolveAtPath(ctx.schema, ctx.data, parent)
                : { data: ctx.data, schema: ctx.schema };
            const node = scoped
                ? resolveSchemaNode(scoped.schema, ctx.schema).node
                      .properties?.[key]
                : undefined;
            if (!scoped || !node) return [];

            const value = scoped.data[key];
            const hasContent = valueHasContent(
                resolveSchemaNode(node, ctx.schema, value),
                value,
                ctx.schema
            );
            return hasContent ? [{ fieldPath, key, scoped }] : [];
        });

        if (!cells.length) return null;

        return (
            <StripContainer>
                {cells.map(({ fieldPath, key, scoped }) => (
                    <MetadataView
                        key={fieldPath}
                        data={scoped.data}
                        schema={scoped.schema}
                        rootSchema={ctx.schema}
                        include={[key]}
                        components={{
                            ...gateway,
                            date: GatewayYear,
                            Container: Fragment,
                            Section: StripCell,
                        }}
                    />
                ))}
            </StripContainer>
        );
    };

    return {
        ...base,
        MetadataView: ({ components, ...props }) => (
            <base.MetadataView
                {...props}
                components={{ ...caseStudyComponents, ...components }}
            />
        ),
        TrialFacts,
    };
};
