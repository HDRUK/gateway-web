import { get } from "lodash";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import BoxContainer from "@/components/BoxContainer";
import DatasetStatCard, {
    DatasetStatCardProps,
} from "@/components/DatasetStatCard/DatasetStatCard";
import {
    formatYearStat,
    formatTextDelimiter,
    parseLeadTime,
    splitStringList,
} from "@/utils/dataset";
import { r } from "msw/lib/glossary-de6278a9";

const TRANSLATION_PATH = "pages.dataset.components.DatasetStats";

const DatasetStats = ({ data }: { data: Partial<VersionItem> }) => {
    const t = useTranslations(TRANSLATION_PATH);

    const spatialCoverage = get(data, "metadata.metadata.coverage.spatial");
    const populationStat = formatTextDelimiter(
        get(
            data,
            "metadata.metadata.summary.populationSize"
        ) as unknown as string
    );
    const yearsStat = formatYearStat(
        get(data, "metadata.metadata.provenance.temporal.startDate"),
        get(data, "metadata.metadata.provenance.temporal.endDate")
    );
    const tissueStat = get(data, "metadata.metadata.coverage.materialType");
    const coverageStat = spatialCoverage
        ? Array.from(new Set(splitStringList(spatialCoverage)))
        : "";
    const leadTimeStat = parseLeadTime(
        get(data, "metadata.metadata.accessibility.access.deliveryLeadTime") ||
            ""
    )?.[0];

    const formattedStats: DatasetStatCardProps[] = [
        {
            title: t("populationTitle"),
            noStatText: t("notReported"),
            stat: populationStat !== "-1" ? populationStat : "",
            unit: t("populationUnit"),
            iconSrc: "/images/dataset/bar-chart.svg",
            largeStatText: true,
            targetScroll: "anchor-Documentation",
            enableScroll: populationStat
                ? populationStat.toString() === "-1"
                    ? false
                    : !!populationStat
                : false,
        },
        {
            title: t("yearTitle"),
            stat: yearsStat,
            iconSrc: "/images/dataset/calendar.svg",
            largeStatText: true,
            targetScroll: "anchor-Coverage",
            enableScroll: !!yearsStat,
        },
        {
            title: t("associatedTissuesTitle"),
            noStatText: t("notReported"),
            stat: tissueStat ?? "",
            iconSrc: "/images/dataset/lungs.svg",
            targetScroll: "anchor-Provenance",
            enableScroll: !!tissueStat,
        },
        {
            title: t("geographicCoverageTitle"),
            noStatText: t("notReported"),
            stat: coverageStat,
            iconSrc: "/images/dataset/map.svg",
            targetScroll: "anchor-Coverage",
            enableScroll: !!coverageStat,
        },
        {
            title: t("leadTimeTitle"),
            noStatText: t("dataOnly"),
            stat: leadTimeStat,
            unit: `${
                parseLeadTime(
                    get(
                        data,
                        "metadata.metadata.accessibility.access.deliveryLeadTime"
                    ) || ""
                )?.[1]
            }`,
            iconSrc: "/images/dataset/clock-white.svg",
            targetScroll: "anchor-DataAccessRequest",
            enableScroll: !!leadTimeStat,
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
                    targetScroll={datasetStat.targetScroll}
                    enableScroll={datasetStat.enableScroll}
                />
            ))}
        </BoxContainer>
    );
};

export default DatasetStats;
