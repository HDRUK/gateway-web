import { Children, cloneElement, isValidElement, ReactNode } from "react";
import MetadataView, {
    JSONSchemaDocument,
    labelFor,
    resolveSchemaNode,
    SectionBlock,
} from "@/modules/MetadataView";

export interface DatasetSectionProps {
    data: Record<string, unknown>;
    schema: JSONSchemaDocument;
    name?: string;
    /** Fields within the section to leave out, e.g. one lifted into a <Prose>. */
    exclude?: string[];
    fields?: boolean;
    children?: ReactNode;
}

const DatasetSection = ({
    data,
    schema,
    name,
    exclude,
    fields = false,
    children,
}: DatasetSectionProps) => {
    const sectionData = name ? (data?.[name] as Record<string, unknown>) : data;

    const rows = (
        <MetadataView
            data={data}
            schema={schema}
            rootSchema={schema}
            path={name}
            exclude={exclude}
        />
    );

    if (!children) return rows;

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

    if (fields || !name) {
        return (
            <>
                {injected}
                {fields && rows}
            </>
        );
    }

    const resolved = resolveSchemaNode(
        schema.properties?.[name],
        schema,
        sectionData
    );

    return (
        <SectionBlock fieldKey={name} heading={labelFor(resolved, name)}>
            {injected}
        </SectionBlock>
    );
};

export default DatasetSection;
