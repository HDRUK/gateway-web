"use client";

import { tokens } from "@hdruk/ui/theme";
import { Divider } from "@mui/material";
import { get, isEqual } from "lodash";
import { useTranslations } from "next-intl";
import { Metadata } from "@/interfaces/Dataset";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { N_A } from "@/consts/dataset";
import { formatTextDelimiter } from "@/utils/dataset";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";

const TRANSLATION_PATH = "pages.dataset.components.Sources";

interface SourcesProps {
    data: Metadata;
}

const Sources = ({ data }: SourcesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { datasetType } = data.provenance.origin;

    const datasetSubTypeArray = [];
    datasetType.forEach(item => {
        if (item.subTypes?.length > 0) {
            datasetSubTypeArray.push(item.subTypes);
        }
    });
    // This is using HDRUK schema so it's not collectionSituation as in the GWDM case
    const { collectionSource } = data.provenance.origin;

    const dataCustodianName = get(data, "summary.dataCustodian.name");

    return (
        <Paper sx={{ borderRadius: `${tokens.radius.small}px`, p: 2 }}>
            <Typography variant="body2">
                <Typography variant="h6" component="span">
                    {`${t("datasetTypes")}: `}
                </Typography>
                {formatTextDelimiter(extractNamesFromDataType(datasetType))}
            </Typography>

            {datasetSubTypeArray.length > 0 &&
                !isEqual(datasetSubTypeArray, [N_A]) && (
                    <Typography variant="body2">
                        <Typography variant="h6" component="span">
                            {`${t("datasetSubtypes")}: `}
                        </Typography>
                        {formatTextDelimiter(datasetSubTypeArray)}
                    </Typography>
                )}

            <Divider sx={{ my: 1 }} />

            {dataCustodianName && (
                <Typography variant="body2">
                    <Typography variant="h6" component="span">
                        {`${t("dataCustodian")}: `}
                    </Typography>
                    {dataCustodianName}
                </Typography>
            )}

            <Typography variant="body2">
                <Typography variant="h6" component="span">
                    {`${t("collectionSources")}: `}
                </Typography>
                {collectionSource
                    ? formatTextDelimiter(collectionSource)
                    : t("noCollectionSources")}
            </Typography>
        </Paper>
    );
};

export default Sources;
