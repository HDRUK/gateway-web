"use client";

import { ReactNode } from "react";
import { tokens } from "@hdruk/ui/theme";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { DatasetSchemaInfo } from "@/interfaces/Dataset";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { SCHEMA_BRANCH } from "@/consts/schema";
import { formatDate } from "@/utils/date";

const TRANSLATION_PATH = "pages.dataset.components.MetadataFormat";
const DATE_FORMAT = "DD/MM/YYYY";
const SCHEMATA_TREE = "https://github.com/HDRUK/schemata-2/tree";

export interface MetadataFormatProps {
    /** The schema the dataset was submitted in; null when not recorded. */
    sourceSchema: DatasetSchemaInfo | null;
    partner: string;
    metadataVersion?: string;
    issued?: string;
    modified?: string;
}

const schemaDefinitionUrl = ({ model, version }: DatasetSchemaInfo) =>
    `${SCHEMATA_TREE}/${SCHEMA_BRANCH}/hdr_schemata/models/${model}/${version}`;

/**
 * Describes the metadata record on the page: the schema it was submitted in,
 * the partner context that owns it, and the record's own version history.
 *
 * The schema shown is the partner ingestion standard (HDRUK, CRUK, ...), never
 * GWDM. GWDM is the Gateway's internal storage model; naming it here would
 * invite people to submit in it.
 */
const MetadataFormat = ({
    sourceSchema,
    partner,
    metadataVersion,
    issued,
    modified,
}: MetadataFormatProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const row = (label: string, value: ReactNode) => (
        <Typography variant="body2" component="p">
            <Typography variant="h6" component="span">
                {`${label}: `}
            </Typography>
            {value}
        </Typography>
    );

    return (
        <Paper sx={{ borderRadius: `${tokens.radius.small}px`, p: 2 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                {t("title")}
            </Typography>

            {sourceSchema &&
                row(
                    t("schema"),
                    sourceSchema.version ? (
                        <>
                            {`${sourceSchema.model} (`}
                            <Link
                                href={schemaDefinitionUrl(sourceSchema)}
                                target="_blank"
                                rel="noopener"
                                aria-label={t("viewSchema", {
                                    schema: `${sourceSchema.model} ${sourceSchema.version}`,
                                })}>
                                {t("schemaDefinition")}
                            </Link>
                            )
                        </>
                    ) : (
                        sourceSchema.model
                    )
                )}
            {sourceSchema?.version &&
                row(t("schemaVersion"), sourceSchema.version)}
            {row(t("partner"), partner)}

            {(metadataVersion || issued || modified) && (
                <Divider sx={{ my: 1 }} />
            )}
            {metadataVersion && row(t("metadataVersion"), metadataVersion)}
            {issued && row(t("issued"), formatDate(issued, DATE_FORMAT))}
            {modified && row(t("modified"), formatDate(modified, DATE_FORMAT))}
        </Paper>
    );
};

export default MetadataFormat;
