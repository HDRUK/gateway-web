"use client";

import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { Metadata } from "@/interfaces/Dataset";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "pages.dataset.components.Sources";

interface SourcesProps {
    data: Metadata;
}

const Sources = ({ data }: SourcesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { datasetType, datasetSubType } = data.summary;
    const { collectionSituation } = data.provenance.origin;

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h4">
                <b> {`${t("datasetTypes")}:`} </b>
                {datasetType}
                {datasetSubType && `, ${datasetSubType}`}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h4">
                <b> {`${t("collectionSources")}:`} </b>
                {collectionSituation || t("noCollectionSources")}
            </Typography>
        </Paper>
    );
};

export default Sources;
