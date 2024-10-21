"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReducedDataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";

const TRANSLATION_PATH = "pages.collection.components.DatasetsContent";

export interface DatasetsContentProps {
    datasets: ReducedDataset[];
    anchorIndex: number;
}

export default function DatasetContent({
    datasets,
    anchorIndex,
}: DatasetsContentProps) {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!datasets.length}
            heading={t("heading", {
                length: datasets.length,
            })}
            defaultExpanded={datasets.length > 0}
            contents={datasets.map(
                (
                    { shortTitle, datasetType, populationSize },
                    index: number
                ) => (
                    <Fragment key={`dataset_${datasets[index].dataset_id}`}>
                        <Link
                            href={`/${RouteName.DATASET_ITEM}/${datasets[index].dataset_id}`}>
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
                        {datasetType && <div>{capitalise(datasetType)}</div>}
                    </Fragment>
                )
            )}
        />
    );
}
