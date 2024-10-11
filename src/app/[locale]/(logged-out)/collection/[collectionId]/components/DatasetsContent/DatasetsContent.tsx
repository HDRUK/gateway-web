"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter, getLatestVersion } from "@/utils/dataset";

const TRANSLATION_PATH = "pages.collection.components.DatasetsContent";

export interface DatasetsContentProps {
    datasets: Dataset[];
    anchorIndex: number;
}

export default function DatasetContent({
    datasets,
    anchorIndex,
}: DatasetsContentProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const datasetsLatestVersions = datasets.map(dataset =>
        getLatestVersion(dataset)
    );

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!datasetsLatestVersions.length}
            heading={t("heading", {
                length: datasetsLatestVersions.length,
            })}
            defaultExpanded={datasetsLatestVersions.length > 0}
            contents={datasetsLatestVersions.map(
                (
                    {
                        metadata: {
                            metadata: {
                                summary: {
                                    shortTitle,
                                    datasetType,
                                    populationSize,
                                },
                            },
                        },
                    },
                    index: number
                ) => (
                    <Fragment key={`dataset_${datasets[index].id}`}>
                        <Link
                            href={`/${RouteName.DATASET_ITEM}/${datasets[index].id}`}>
                            {shortTitle}
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
