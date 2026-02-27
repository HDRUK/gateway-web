"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter } from "@/utils/dataset";
import { isEmpty } from "lodash";
import { data } from "cypress/types/jquery";

export interface DatasetsContentProps {
    datasets: DataCustodianDataset[];
    anchorIndex: number;
    translationPath: string;
    selectedTeamIds: Set<string>;
}

const TRANSLATION_PATH = ".components.DatasetsContent";

export default function DatasetContent({
    datasets,
    anchorIndex,
    translationPath,
    selectedTeamIds,
}: DatasetsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const activeDatasets = 
        datasets.filter((dataset) => 
            isEmpty(selectedTeamIds) ? true : (dataset.team_id ? selectedTeamIds.has(dataset.team_id) : false));

        return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!activeDatasets.length}
            heading={t("heading", {
                length: activeDatasets.length,
            })}
            defaultExpanded={activeDatasets.length > 0}
            contents={activeDatasets.map(
                ({ id, title, name, populationSize, datasetType }) => (
                    <Fragment key={`dataset_${id}`}>
                        <Link href={`/${RouteName.DATASET_ITEM}/${id}`}>
                            {title || name}
                        </Link>
                        {populationSize && (
                            <div>
                                {t("populationSize", {
                                    length:
                                        populationSize > 0
                                            ? populationSize.toLocaleString()
                                            : t("unknownString"),
                                })}
                            </div>
                        )}
                        <div>{formatTextDelimiter(datasetType)}</div>
                    </Fragment>
                )
            )}
        />
    );
}
