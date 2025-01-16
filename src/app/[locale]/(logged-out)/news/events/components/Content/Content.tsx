"use client";

import { useMemo } from "react";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { rangeRight } from "lodash";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { EventNode } from "@/interfaces/Events";
import { NewsNode } from "@/interfaces/News";
import Box from "@/components/Box";
import NewsSummaryCard from "@/components/NewsSummaryCard";
import Tabs from "@/components/Tabs";
import { RouteName } from "@/consts/routeName";
import { getNewsEventsByYear } from "@/utils/newsEvents";

interface ContentProps {
    data: EventNode[] | NewsNode[];
}

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.newsEvents";

const Content = ({ data }: ContentProps) => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    const currentYear = dayjs().year();
    const params = useSearchParams();

    const tab = params?.get("tab") || "news";

    const generatedData = useMemo(() => {
        const years = rangeRight(2024, currentYear + 2).map(String);

        return years.map(year => {
            const dataByYear = getNewsEventsByYear(data, year);
            // Next year's tab should only show if it contains an item
            if (Number(year) === currentYear + 1 && dataByYear.length === 0) {
                return {};
            }
            return {
                label: year,
                value: year,
                content: (
                    <div>
                        {!dataByYear.length ? (
                            <Box component="p" sx={{ px: 2 }}>
                                {t("noResults", {
                                    year,
                                })}
                            </Box>
                        ) : (
                            <Grid container rowSpacing={4} columnSpacing={4}>
                                {dataByYear.map(item => {
                                    return (
                                        <Grid
                                            item
                                            desktop={3}
                                            tablet={4}
                                            mobile={12}>
                                            <NewsSummaryCard
                                                summary={item.newsFields.text}
                                                imageLink={
                                                    item.newsFields?.image?.node
                                                        ?.mediaItemUrl
                                                }
                                                imageAlt={
                                                    item.newsFields?.image?.node
                                                        ?.altText
                                                }
                                                headline={
                                                    item.newsFields.headline
                                                }
                                                date={item.newsFields.date}
                                                url={
                                                    item.newsFields?.link
                                                        ?.url ||
                                                    `/${
                                                        tab === "news"
                                                            ? RouteName.NEWS_ARTICLE
                                                            : RouteName.EVENT_ARTICLE
                                                    }/${item.slug}`
                                                }
                                                buttonText={
                                                    item.newsFields?.link
                                                        ?.title || t("readMore")
                                                }
                                                key={item.newsFields.headline}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </div>
                ),
            };
        })
        .filter((yearTab: object) => Object.keys(yearTab).length > 0);
    }, [data]);

    return (
        <Tabs
            defaultSelectedTab={currentYear.toString()}
            paramName="year"
            centered
            tabs={generatedData}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default Content;
