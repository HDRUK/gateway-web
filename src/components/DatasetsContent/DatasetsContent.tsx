"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { NetworkDataset } from "@/interfaces/DataCustodianNetwork";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import AccordionSectionSplit from "@/components/AccordionSectionSplit";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter } from "@/utils/dataset";

export interface DatasetsContentProps {
    datasets: DataCustodianDataset[];
    associatedDatasets?: NetworkDataset[];
    anchorIndex: number;
    translationPath: string;
    selectedTeamIds?: Set<string>;
}

const TRANSLATION_PATH = ".components.DatasetsContent";

export default function DatasetContent({
    datasets,
    associatedDatasets,
    anchorIndex,
    translationPath,
    selectedTeamIds,
}: DatasetsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));
    const activeDatasets = datasets.filter(dataset =>
        isEmpty(selectedTeamIds)
            ? true
            : dataset.team_id
            ? !!selectedTeamIds?.has(dataset.team_id)
            : false
    );

    const renderCard = (dataset: DataCustodianDataset | NetworkDataset) => {
        const { id, title, populationSize, datasetType, team } = dataset;
        const name = "name" in dataset ? dataset.name : undefined;

        return (
            <Fragment key={`dataset_${id}`}>
                <Link href={`/${RouteName.DATASET_ITEM}/${id}`}>
                    {title || name}
                </Link>
                {team && (
                    <Link
                        href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${team.id}`}>
                        {team.name}
                    </Link>
                )}
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
        );
    };

    if (associatedDatasets === undefined) {
        return (
            <AccordionSection
                id={`anchor${anchorIndex}`}
                disabled={!activeDatasets.length}
                heading={t("heading", {
                    length: activeDatasets.length,
                })}
                defaultExpanded={activeDatasets.length > 0}
                contents={activeDatasets.map(renderCard)}
            />
        );
    }

    return (
        <AccordionSectionSplit
            id={`anchor${anchorIndex}`}
            disabled={!activeDatasets.length && !associatedDatasets.length}
            heading={t("title")}
            ownedHeading={t("title")}
            ownedCount={activeDatasets.length}
            associatedHeading={t("associatedHeading")}
            associatedCount={associatedDatasets.length}
            defaultExpanded={
                activeDatasets.length > 0 || associatedDatasets.length > 0
            }
            ownedContents={activeDatasets.map(renderCard)}
            associatedContents={associatedDatasets.map(renderCard)}
        />
    );
}
