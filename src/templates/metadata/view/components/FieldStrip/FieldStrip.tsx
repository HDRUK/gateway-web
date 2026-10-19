import { Children } from "react";
import { tokens } from "@hdruk/ui/theme";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import MetadataView, {
    ContainerProps,
    JSONSchemaDocument,
    MetadataViewComponents,
    resolveAtPath,
    SectionProps,
} from "@/modules/MetadataView";

export interface FieldStripProps {
    fields: string[];
    data: Record<string, unknown>;
    schema: JSONSchemaDocument;
    /**
     * The node holding `fields`, e.g. GWDM's "required" for version, issued
     * and modified. Defaults to the top level.
     */
    path?: string;
    /** Value renderer overrides; the strip keeps its own Container and Section. */
    components?: MetadataViewComponents;
}

const StripContainer = ({ children }: ContainerProps) =>
    Children.count(children) === 0 ? null : (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                p: 2,
                mt: 2,
                bgcolor: "greyCustom.light",
                borderRadius: `${tokens.radius.small}px`,
            }}>
            {children}
        </Box>
    );

const StripCell = ({ label, children }: SectionProps) => (
    <Box sx={{ p: 0 }}>
        <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}>
            {label}
        </Typography>
        <Box sx={{ p: 0, wordBreak: "break-all" }}>{children}</Box>
    </Box>
);

/**
 * Identifiers, versions and timestamps are record-keeping rather than content:
 * one compact strip instead of a full-width section each. Values go through
 * MetadataView so labels and date formatting match the rest of the page.
 */
const FieldStrip = ({
    fields,
    data,
    schema,
    path,
    components,
}: FieldStripProps) => {
    const scoped = path ? resolveAtPath(schema, data, path) : undefined;
    if (path && !scoped) return null;

    return (
        <MetadataView
            data={scoped?.data ?? data}
            schema={scoped?.schema ?? schema}
            rootSchema={schema}
            include={fields}
            components={{
                ...components,
                Container: StripContainer,
                Section: StripCell,
            }}
        />
    );
};

export default FieldStrip;
