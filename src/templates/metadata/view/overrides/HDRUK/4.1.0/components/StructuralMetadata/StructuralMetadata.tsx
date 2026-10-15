import MetadataView, {
    JSONSchemaDocument,
    JSONSchemaNode,
} from "@/modules/MetadataView";
import {
    DataTable,
    StructuralMetadata1,
} from "@/generated/schemas/HDRUK/4.1.0";

export interface StructuralMetadataProps {
    data?: StructuralMetadata1;
    schema?: JSONSchemaNode;
    rootSchema?: JSONSchemaDocument;
}

/**
 * The only thing to edit here. The HDR UK translation emits one `tables[]`
 * entry per column, every one named the same, so the default accordion-per-
 * entry repeats one heading seven times. Collapse them however you like - the
 * result renders back through the generic view, so whatever shape you return
 * is laid out from the schema as usual.
 */
export const mergeTables = (tables: DataTable[]): DataTable[] => {
    const byName = new Map<string, DataTable & { descriptions: Set<string> }>();

    tables.forEach(table => {
        const key = table.name ?? "";
        const group = byName.get(key) ?? {
            ...table,
            columns: [],
            descriptions: new Set<string>(),
        };

        group.columns.push(...(table.columns ?? []));
        if (table.description) group.descriptions.add(table.description);

        byName.set(key, group);
    });

    return [...byName.values()].map(({ descriptions, ...table }) => ({
        ...table,
        description: [...descriptions].join(" · ") || undefined,
    }));
};

const StructuralMetadata = ({
    data,
    schema,
    rootSchema,
}: StructuralMetadataProps) => {
    const tables = mergeTables(data?.tables ?? []);

    if (!tables.length || !schema || !rootSchema) return null;

    return (
        <MetadataView
            data={{ tables }}
            schema={schema}
            rootSchema={rootSchema}
            
        />
    );
};

export default StructuralMetadata;
