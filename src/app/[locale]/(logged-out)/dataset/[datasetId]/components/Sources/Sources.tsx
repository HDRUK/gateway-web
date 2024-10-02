"use client";

import { Divider } from "@mui/material";
import { isEqual } from "lodash";
import { useTranslations } from "next-intl";
import { Metadata } from "@/interfaces/Dataset";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { formatTextDelimiter } from "@/utils/dataset";

const TRANSLATION_PATH = "pages.dataset.components.Sources";

interface SourcesProps {
    data: Metadata;
}

const Sources = ({ data }: SourcesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { datasetType, datasetSubType } = data.provenance.origin;
    const { collectionSituation } = data.provenance.origin;

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h4">
                <b>{`${t("datasetTypes")}: `}</b>
                {formatTextDelimiter(datasetType)}
            </Typography>

            {datasetSubType && !isEqual(datasetSubType, ["Not applicable"]) && (
                <Typography variant="h4">
                    <b>{`${t("datasetSubtypes")}: `}</b>
                    {formatTextDelimiter(datasetSubType)}
                </Typography>
            )}

            <Divider sx={{ my: 1 }} />
            <Typography variant="h4">
                <b>{`${t("collectionSources")}: `}</b>
                {collectionSituation
                    ? formatTextDelimiter(collectionSituation)
                    : t("noCollectionSources")}
            </Typography>
        </Paper>
    );
};

export default Sources;
