"use client";

import { InView } from "react-intersection-observer";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { RouteName } from "@/consts/routeName";
import { getLatestVersion } from "@/utils/dataset";
import { toTitleCase } from "@/utils/string";
import AccordionSection from "../AccordionSection";

const TRANSLATION_PATH = "pages.collection.components.DatasetsContent";

export interface DatasetsContentProps {
    datasets: Dataset[];
    anchorIndex: number;
}

export default function DatasetContent({
    datasets,
    anchorIndex,
}: DatasetsContentProps) {
    const router = useRouter();
    const path = usePathname();
    const t = useTranslations(TRANSLATION_PATH);

    const datasetsLatestVersions = datasets.map(({ versions }) =>
        getLatestVersion(versions)
    );

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
                disabled={!datasetsLatestVersions.length}
                heading={t("heading", {
                    length: datasetsLatestVersions.length,
                })}
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
                        <>
                            <Link
                                href={`/${RouteName.DATASET_ITEM}/${datasets[index].id}`}>
                                {shortTitle}
                            </Link>
                            {populationSize && (
                                <div>
                                    {t("populationSize", {
                                        length: populationSize,
                                    })}
                                </div>
                            )}
                            <div>{toTitleCase(datasetType)}</div>
                        </>
                    )
                )}
            />
        </InView>
    );
}
