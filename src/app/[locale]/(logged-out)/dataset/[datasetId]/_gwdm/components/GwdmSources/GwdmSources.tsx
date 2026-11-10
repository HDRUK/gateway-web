"use client";

import { tokens } from "@hdruk/ui/theme";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { formatTextDelimiter } from "@/utils/dataset";

// Same strings as the production Sources panel, so the two pages read alike.
const TRANSLATION_PATH = "pages.dataset.components.Sources";

export interface GwdmSourcesProps {
    datasetTypes: string[];
    datasetSubTypes: string[];
    custodianName?: string;
    collectionSituations: string[];
}

/**
 * The Sources panel for native GWDM. The production panel destructures
 * HDRUK's provenance.origin.datasetType, which GWDM does not have; this reads
 * the equivalent facts from GwdmPageFacts instead.
 *
 * Unlike production it shows no schema version: GWDM is the Gateway's
 * internal storage model, and partner schemas are the ingestion standard.
 */
const GwdmSources = ({
    datasetTypes,
    datasetSubTypes,
    custodianName,
    collectionSituations,
}: GwdmSourcesProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper sx={{ borderRadius: `${tokens.radius.small}px`, p: 2 }}>
            <Typography variant="body2">
                <Typography variant="h6" component="span">
                    {`${t("datasetTypes")}: `}
                </Typography>
                {formatTextDelimiter(datasetTypes)}
            </Typography>

            {datasetSubTypes.length > 0 && (
                <Typography variant="body2">
                    <Typography variant="h6" component="span">
                        {`${t("datasetSubtypes")}: `}
                    </Typography>
                    {formatTextDelimiter(datasetSubTypes)}
                </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {custodianName && (
                <Typography variant="body2">
                    <Typography variant="h6" component="span">
                        {`${t("dataCustodian")}: `}
                    </Typography>
                    {custodianName}
                </Typography>
            )}

            <Typography variant="body2">
                <Typography variant="h6" component="span">
                    {`${t("collectionSources")}: `}
                </Typography>
                {collectionSituations.length
                    ? formatTextDelimiter(collectionSituations)
                    : t("noCollectionSources")}
            </Typography>
        </Paper>
    );
};

export default GwdmSources;
