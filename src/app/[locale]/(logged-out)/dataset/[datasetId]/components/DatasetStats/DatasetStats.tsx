import { getTranslations } from "next-intl/server";
import BoxContainer from "@/components/BoxContainer";
import DatasetStatCard from "@/components/DatasetStatCard";

const TRANSLATION_PATH = "pages.dataset.components.DatasetStats";

const DatasetStats = async () => {
    const t = await getTranslations(TRANSLATION_PATH);

    const TEMP_POPULATION_STAT = {
        title: t("populationTitle"),
        unit: t("populationUnit"),
        icon: "/images/dataset/bar-chart.svg",
        stat: "10,000",
        largeStat: true,
    };

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
            <DatasetStatCard
                title={TEMP_POPULATION_STAT.title}
                stat={TEMP_POPULATION_STAT.stat}
                largeStatText={TEMP_POPULATION_STAT.largeStat}
                unit={TEMP_POPULATION_STAT.unit}
                iconSrc={TEMP_POPULATION_STAT.icon}
            />
        </BoxContainer>
    );
};

export default DatasetStats;
