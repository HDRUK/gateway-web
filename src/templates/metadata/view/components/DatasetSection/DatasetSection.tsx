import {
    Children,
    cloneElement,
    Fragment,
    isValidElement,
    ReactNode,
} from "react";
import MetadataView, {
    JSONSchemaDocument,
    labelFor,
    MetadataViewComponents,
    resolveSchemaNode,
    SectionBlock,
    sectionHasContent,
    SectionProps,
} from "@/modules/MetadataView";

export interface DatasetSectionProps {
    data: Record<string, unknown>;
    schema: JSONSchemaDocument;
    name?: string;
    /** Fields within the section to leave out, e.g. one lifted into a <Prose>. */
    exclude?: string[];
    fields?: boolean;
    children?: ReactNode;
    /** Renderer overrides, as for <MetadataView>. */
    components?: MetadataViewComponents;
    /**
     * Sections rendered by a dedicated component instead of rows, keyed by
     * section name - e.g. observations as the production observations table.
     * Ignored when the template passes children of its own.
     */
    specialSections?: Record<string, (value: unknown) => ReactNode>;
}

// A section's body with no heading, for placing under one drawn here.
const BodyOnly = ({ children }: SectionProps) => <>{children}</>;

const DatasetSection = ({
    data,
    schema,
    name,
    exclude,
    fields = false,
    children,
    components,
    specialSections,
}: DatasetSectionProps) => {
    const sectionData = name ? (data?.[name] as Record<string, unknown>) : data;

    if (name && !sectionHasContent(schema, data, name)) return null;

    // This section's heading and anchor, drawn as the active renderer draws one.
    const block = (content: ReactNode) => {
        if (!name) return content;

        const resolved = resolveSchemaNode(
            schema.properties?.[name],
            schema,
            sectionData
        );
        const heading = labelFor(resolved, name);
        const Section = components?.Section;

        return Section ? (
            <Section
                fieldKey={name}
                label={heading}
                resolved={resolved}
                isBlock
                isLast={false}>
                {content}
            </Section>
        ) : (
            <SectionBlock fieldKey={name} heading={heading}>
                {content}
            </SectionBlock>
        );
    };

    const special = name && !children ? specialSections?.[name] : undefined;
    if (special) return block(special(sectionData));

    if (!children) {
        return (
            <MetadataView
                data={data}
                schema={schema}
                rootSchema={schema}
                path={name}
                exclude={exclude}
                components={components}
            />
        );
    }

    // Injected rather than provided via context so the whole tree stays a
    // server component; a provider would force "use client" on every
    // consumer. A child passing its own `data` keeps it.
    const injected = Children.map(children, child =>
        isValidElement(child)
            ? cloneElement(child as React.ReactElement, {
                  data: (child.props as { data?: unknown }).data ?? sectionData,
                  schema: name ? schema.properties?.[name] : schema,
                  rootSchema: schema,
              })
            : child
    );

    if (!name) {
        return (
            <>
                {injected}
                {fields && (
                    <MetadataView
                        data={data}
                        schema={schema}
                        rootSchema={schema}
                        exclude={exclude}
                        components={components}
                    />
                )}
            </>
        );
    }

    // Heading, then the child, then the remaining rows - as the production
    // page lays out Summary: heading, abstract, then the fields.
    return block(
        <>
            {injected}
            {fields && (
                <MetadataView
                    data={data}
                    schema={schema}
                    rootSchema={schema}
                    path={name}
                    exclude={exclude}
                    components={{
                        ...components,
                        Container: Fragment,
                        Section: BodyOnly,
                    }}
                />
            )}
        </>
    );
};

export default DatasetSection;
