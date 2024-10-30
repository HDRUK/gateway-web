"use client";

import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { formatTextDelimiter, getLatestVersions } from "@/utils/dataset";
import { toTitleCase } from "@/utils/string";

const TRANSLATION_PATH = "pages.tool.components.DatasetsContent";

export interface DatasetsContentProps {
    dataset_versions: VersionItem[];
    anchorIndex: number;
}

export default function DatasetContent({
    dataset_versions,
    anchorIndex,
}: DatasetsContentProps) {
    const t = useTranslations(TRANSLATION_PATH);

    const datasetsLatestVersions = getLatestVersions(dataset_versions ?? []);

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
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
                    dataset_id: number
                ) => (
                    <>
                        <Link href={`/${RouteName.DATASET_ITEM}/${dataset_id}`}>
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
                    </>
                )
            )}
        />
    );
}
