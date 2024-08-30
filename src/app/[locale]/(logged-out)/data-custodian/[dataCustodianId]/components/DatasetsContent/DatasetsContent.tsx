"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import { RouteName } from "@/consts/routeName";
import { toTitleCase } from "@/utils/string";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.dataCustodian.components.DatasetsContent";

export interface DatasetsContentProps {
    datasets: DataCustodianDataset[];
    anchorIndex: number;
}

export default function DatasetContent({
    datasets,
    anchorIndex,
}: DatasetsContentProps) {
    const router = useRouter();
    const path = usePathname();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <InView
            id={`anchor${anchorIndex}`}
            threshold={1}
            as="div"
            onChange={inView => {
                if (inView && path) {
                    router.replace(`${path}?section=${anchorIndex}`, {
                        scroll: false,
                    });
                }
            }}>
            <AccordionSection
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
                                                : "Unknown",
                                    })}
                                </div>
                            )}
                            <div>{toTitleCase(datasetType)}</div>
                        </Fragment>
                    )
                )}
            />
        </InView>
    );
}
