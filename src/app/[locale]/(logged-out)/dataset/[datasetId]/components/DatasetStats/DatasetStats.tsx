import { get } from "lodash";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import BoxContainer from "@/components/BoxContainer";
import DatasetStatCard, {
    DatasetStatCardProps,
} from "@/components/DatasetStatCard/DatasetStatCard";
import {
    formatYearStat,
    parseLeadTime,
    splitStringList,
} from "@/utils/dataset";

const TRANSLATION_PATH = "pages.dataset.components.DatasetStats";

const DatasetStats = ({ data }: { data: Partial<VersionItem> }) => {
    const t = useTranslations(TRANSLATION_PATH);

    const spatialCoverage = get(data, "metadata.metadata.coverage.spatial");

    const formattedStats: DatasetStatCardProps[] = [
        {
            title: t("populationTitle"),
            noStatText: t("notReported"),
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
            noStatText: t("notReported"),
            stat: `${get(
                data,
                "metadata.metadata.coverage.biologicalsamples"
            )}`,
            iconSrc: "/images/dataset/pie-chart.svg",
        },
        {
            title: t("geographicCoverageTitle"),
            noStatText: t("notReported"),
            stat: spatialCoverage
                ? Array.from(new Set(splitStringList(spatialCoverage)))
                : "",
            iconSrc: "/images/dataset/map.svg",
        },
        {
            title: t("leadTimeTitle"),
            noStatText: t("dataOnly"),
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
            {formattedStats.map(datasetStat => (
                <DatasetStatCard
                    title={datasetStat.title}
                    stat={datasetStat.stat}
                    noStatText={datasetStat.noStatText}
                    largeStatText={!!datasetStat.largeStatText}
                    unit={datasetStat.unit}
                    iconSrc={datasetStat.iconSrc}
                />
            ))}
        </BoxContainer>
    );
};

export default DatasetStats;
