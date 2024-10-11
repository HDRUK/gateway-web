"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { toTitleCase } from "@/utils/string";

export interface DatasetsContentProps {
    datasets: DataCustodianDataset[];
    anchorIndex: number;
    translationPath: string;
}

const TRANSLATION_PATH = ".components.DatasetsContent";

export default function DatasetContent({
    datasets,
    anchorIndex,
    translationPath,
}: DatasetsContentProps) {
    const t = useTranslations(translationPath.concat(TRANSLATION_PATH));

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!datasets.length}
            heading={t("heading", {
                length: datasets.length,
            })}
            defaultExpanded={datasets.length > 0}
            contents={datasets.map(
                ({ id, title, populationSize, datasetType }) => (
                    <Fragment key={`dataset_${id}`}>
                        <Link href={`/${RouteName.DATASET_ITEM}/${id}`}>
                            {title}
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
                        <div>{toTitleCase(datasetType)}</div>
                    </Fragment>
                )
            )}
        />
    );
}
