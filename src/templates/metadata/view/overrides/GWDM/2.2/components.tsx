import { ComponentType, ReactNode } from "react";
import { tokens } from "@hdruk/ui/theme";
import Box from "@/components/Box";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { SectionProps } from "@/modules/MetadataView";
import { Gwdm22 } from "@/generated/schemas/GWDM/2.2";
import {
    BaseVocabulary,
    makeBaseComponents,
    MetadataViewContext,
} from "../../../baseComponents";

const SCHEMA_DOCS_URL =
    "https://github.com/HDRUK/schemata/blob/master/hdr_schemata/models/GWDM/2.2/schema.json";

export type Section = keyof Gwdm22;

export type Vocabulary = BaseVocabulary<Section> & {
    SchemaNote: ComponentType<{ children?: ReactNode }>;
    CardSection: ComponentType<SectionProps>;
};

export const makeComponents = (ctx: MetadataViewContext): Vocabulary => ({
    ...makeBaseComponents<Section>(ctx),

    SchemaNote: ({ children }) => (
        <Box
            sx={{
                borderLeft: 4,
                borderColor: "primary.main",
                bgcolor: "greyCustom.light",
                borderRadius: `${tokens.radius.small}px`,
                my: 2,
            }}>
            <Typography variant="body2" component="div">
                {children}
            </Typography>
            <Link href={SCHEMA_DOCS_URL}>View the GWDM 2.2 schema</Link>
        </Box>
    ),

    // Replaces the section wrapper rather than the values: a compact card per
    // section instead of the default heading-and-divider.
    CardSection: ({ label, children }) => (
        <Box
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: `${tokens.radius.small}px`,
                mb: 2,
            }}>
            <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
                {label}
            </Typography>
            {children}
        </Box>
    ),
});
