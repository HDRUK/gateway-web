"use client";

import { Divider } from "@mui/material";
import { isEqual } from "lodash";
import { useTranslations } from "next-intl";
import { Metadata } from "@/interfaces/Dataset";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { formatTextDelimiter } from "@/utils/dataset";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";

const TRANSLATION_PATH = "pages.dataset.components.Sources";

interface SourcesProps {
    data: Metadata;
}

const Sources = ({ data }: SourcesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { datasetType } = data.provenance.origin;

    const datasetSubTypeArray = datasetType.map(item =>
        item.subTypes && item.subTypes.length > 0 ? item.subTypes : null
    );
    // This is using HDRUK schema so it's not collectionSituation as in the GWDM case
    const { collectionSource } = data.provenance.origin;

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h4">
                <b>{`${t("datasetTypes")}: `}</b>
                {formatTextDelimiter(extractNamesFromDataType(datasetType))}
            </Typography>

            {datasetSubTypeArray &&
                !isEqual(datasetSubTypeArray, ["Not applicable"]) && (
                    <Typography variant="h4">
                        <b>{`${t("datasetSubtypes")}: `}</b>
                        {formatTextDelimiter(datasetSubTypeArray)}
                    </Typography>
                )}

            <Divider sx={{ my: 1 }} />
            <Typography variant="h4">
                <b>{`${t("collectionSources")}: `}</b>
                {collectionSource
                    ? formatTextDelimiter(collectionSource)
                    : t("noCollectionSources")}
            </Typography>
        </Paper>
    );
};

export default Sources;
