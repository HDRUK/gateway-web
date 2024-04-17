import { get } from "lodash";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import BoxContainer from "@/components/BoxContainer";
import DatasetStatCard, {
    DatasetStatCardProps,
} from "@/components/DatasetStatCard/DatasetStatCard";
import {
    formatYearStat,
    hasValidValue,
    parseLeadTime,
    splitStringList,
} from "@/utils/dataset";

const TRANSLATION_PATH = "pages.dataset.components.DatasetStats";

const DatasetStats = ({ data }: { data: Partial<VersionItem> }) => {
    const t = useTranslations(TRANSLATION_PATH);

    const formattedStats: DatasetStatCardProps[] = [
        {
            title: t("populationTitle"),
            stat: get(
                data,
                "metadata.metadata.summary.populationSize"
            ) as unknown as string,
            unit: t("populationUnit"),
            iconSrc: "/images/dataset/bar-chart.svg",
            largeStatText: true,
        },
        {
            title: t("yearTitle"),
            stat: formatYearStat(
                get(data, "metadata.metadata.provenance.temporal.startDate"),
                get(data, "metadata.metadata.provenance.temporal.endDate")
            ),
            iconSrc: "/images/dataset/calendar.svg",
            largeStatText: true,
        },
        {
            title: t("associatedTissuesTitle"),
            stat: `${get(
                data,
                "metadata.metadata.coverage.biologicalsamples"
            )}`,
            iconSrc: "/images/dataset/pie-chart.svg",
        },
        {
            title: t("geographicCoverageTitle"),
            stat: Array.from(
                new Set(
                    splitStringList(
                        get(
                            data,
                            "metadata.metadata.coverage.spatial"
                        ) as unknown as string
                    )
                )
            ),
            iconSrc: "/images/dataset/map.svg",
        },
        {
            title: t("leadTimeTitle"),
            stat: `${
                parseLeadTime(
                    get(
                        data,
                        "metadata.metadata.accessibility.access.deliveryLeadTime"
                    ) || ""
                )?.[0]
            }`,
            unit: `${
                parseLeadTime(
                    get(
                        data,
                        "metadata.metadata.accessibility.access.deliveryLeadTime"
                    ) || ""
                )?.[1]
            }`,
            iconSrc: "/images/dataset/clock-white.svg",
        },
    ];

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(2, 1fr)",
                    desktop: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
            }}>
            {formattedStats.map(
                datasetStat =>
                    hasValidValue(datasetStat.stat) && (
                        <DatasetStatCard
                            title={datasetStat.title}
                            stat={datasetStat.stat}
                            largeStatText={!!datasetStat.largeStatText}
                            unit={datasetStat.unit}
                            iconSrc={datasetStat.iconSrc}
                        />
                    )
            )}
        </BoxContainer>
    );
};

export default DatasetStats;
