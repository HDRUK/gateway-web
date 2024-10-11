"use client";

import { Fragment } from "react";
import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter } from "@/utils/dataset";

export interface DatasetsContentProps {
    datasets: DataCustodianDataset[];
    anchorIndex: number;
    page: string;
}

export default function DatasetContent({
    datasets,
    anchorIndex,
    page,
}: DatasetsContentProps) {
    const router = useRouter();
    const path = usePathname();
    const TRANSLATION_PATH = `pages.${page}.components.DatasetsContent`;

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
                                                : t("unknownString"),
                                    })}
                                </div>
                            )}
                            <div>{formatTextDelimiter(datasetType)}</div>
                        </Fragment>
                    )
                )}
            />
        </InView>
    );
}
