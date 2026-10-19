import { ReactNode } from "react";
import FieldRows from "./components/FieldRows";
import {
    defaultRenderers,
    DefaultContainer,
    DefaultFieldLabel,
    DefaultSection,
    DepthLimit,
    MAX_RECURSE_DEPTH,
    RenderFn,
} from "./components/defaultRenderers";
import { JSONSchemaDocument, MetadataViewProps, RendererProps } from "./types";
import {
    inferRenderStrategy,
    rendersAsBlock,
} from "./utils/inferRenderStrategy";
import { isEmptyValue } from "./utils/isEmptyValue";
import { labelFor } from "./utils/labelFor";
import { resolveAtPath } from "./utils/resolveAtPath";
import { resolveSchemaNode } from "./utils/resolveSchemaNode";
import { valueHasContent } from "./utils/sectionHasContent";

const MetadataView = ({
    data,
    schema,
    rootSchema,
    path,
    include,
    exclude,
    components = {},
}: MetadataViewProps) => {
    // `schema` may be a subtree (e.g. props.schema.properties.provenance), in
    // which case $refs still point at the full document's $defs.
    const refSource = (rootSchema ?? schema) as JSONSchemaDocument;

    // `path` names one node, which renders as a single titled section - so
    // scope to its parent and select the final segment. Iterating the node's
    // own properties instead would lose its heading and leave every scalar
    // child to be rendered as a section in its own right.
    const segments = path?.split(".").filter(Boolean) ?? [];
    const target = segments.pop();
    const parentPath = segments.join(".");

    const scoped = parentPath
        ? resolveAtPath(refSource, data, parentPath)
        : undefined;
    if (parentPath && !scoped) return null;

    const activeData = scoped?.data ?? data;
    const activeSchema = scoped?.schema ?? schema;

    const resolvedRoot = resolveSchemaNode(activeSchema, refSource);
    const properties = resolvedRoot.node.properties ?? {};

    const {
        Container = DefaultContainer,
        Section = DefaultSection,
        FieldLabel = DefaultFieldLabel,
        ...rendererOverrides
    } = components;

    const render: RenderFn = (resolved, value, depth, valuePath) => {
        const props: RendererProps = {
            value,
            resolved,
            rootSchema: refSource,
            depth,
            path: valuePath,
            renderDefault: () => null,
            render,
        };

        if (depth > MAX_RECURSE_DEPTH) return <DepthLimit {...props} />;

        const strategy = inferRenderStrategy(resolved, value, refSource);
        if (strategy === "empty") return null;

        const Default = defaultRenderers[strategy];
        const Override = rendererOverrides[strategy];
        const Component = Override ?? Default;

        return (
            <Component
                {...props}
                renderDefault={() => <Default {...props} />}
            />
        );
    };

    // Without `path`, `exclude` filters the sections. With it there is only
    // one section, so it has to filter that section's own fields instead.
    const selection = target ? [target] : include;
    const sectionExclude = target ? undefined : exclude;
    const fieldExclude = target ? exclude : undefined;

    const keys = Object.keys(properties)
        .filter(key => !selection || selection.includes(key))
        .filter(key => !sectionExclude?.includes(key));

    const sections = keys
        .map(key => {
            const value = activeData?.[key];
            if (isEmptyValue(value)) return null;

            const resolved = resolveSchemaNode(
                properties[key],
                refSource,
                value
            );

            const strategy = inferRenderStrategy(resolved, value, refSource);

            // A renderer that bails produces an element that is still truthy,
            // so `!body` below cannot see it. Rows are the case that bails -
            // an object schema holding a scalar has no leaves to show - and a
            // bare heading over nothing is worse than no section at all.
            // Shared with SectionNav so the nav never links to such a section.
            if (!valueHasContent(resolved, value, refSource)) return null;

            const rendersRows =
                strategy === "objectGrid" || strategy === "nestedSection";

            // Full path from the document root, so renderers can recognise a
            // field even when this view is scoped with `path`.
            const sectionPath = parentPath ? `${parentPath}.${key}` : key;

            const omitsFields = !!fieldExclude?.length && rendersRows;

            const body = omitsFields ? (
                <FieldRows
                    value={value}
                    resolved={resolved}
                    rootSchema={refSource}
                    depth={0}
                    path={sectionPath}
                    render={render}
                    renderDefault={() => null}
                    exclude={fieldExclude}
                />
            ) : (
                render(resolved, value, 0, sectionPath)
            );
            if (!body) return null;

            return {
                key,
                resolved,
                isBlock: rendersAsBlock(resolved, value, refSource),
                body,
            };
        })
        .filter(Boolean) as {
        key: string;
        resolved: ReturnType<typeof resolveSchemaNode>;
        isBlock: boolean;
        body: ReactNode;
    }[];

    return (
        <Container>
            {sections.map(({ key, resolved, isBlock, body }, index) => (
                <Section
                    key={key}
                    fieldKey={key}
                    resolved={resolved}
                    isBlock={isBlock}
                    isLast={index === sections.length - 1}
                    label={
                        <FieldLabel
                            fieldKey={key}
                            label={labelFor(resolved, key)}
                            resolved={resolved}
                        />
                    }>
                    {body}
                </Section>
            ))}
        </Container>
    );
};

export default MetadataView;
