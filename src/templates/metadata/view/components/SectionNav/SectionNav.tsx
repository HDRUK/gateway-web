import { SxProps, Theme } from "@mui/material";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import {
    JSONSchemaDocument,
    labelFor,
    resolveSchemaNode,
    sectionAnchorId,
    sectionHasContent,
} from "@/modules/MetadataView";

export interface SectionNavProps {
    /** Section keys in the order the template renders them. */
    sections: string[];
    data: Record<string, unknown>;
    schema: JSONSchemaDocument;
    sx?: SxProps<Theme>;
}

/**
 * The nav cannot observe what the content rendered - it sits in an earlier
 * column of the same server tree - so the template declares the order. Labels
 * and emptiness still come from the schema, so a section with no data drops
 * out of both at once.
 */
const SectionNav = ({ sections, data, schema, sx }: SectionNavProps) => {
    const properties = schema.properties ?? {};

    const items = sections
        .filter(name => sectionHasContent(schema, data, name))
        .map(name => ({
            label: labelFor(resolveSchemaNode(properties[name], schema), name),
            anchorId: sectionAnchorId(name),
        }));

    if (!items.length) return null;

    return <ActiveListSidebar items={items} sx={sx} />;
};

export default SectionNav;
