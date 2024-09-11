"use client";

import { useMemo } from "react";
import { Grid } from "@mui/material";
import { rangeRight } from "lodash";
import { useTranslations } from "next-intl";
import { EventNode } from "@/interfaces/Events";
import { NewsNode } from "@/interfaces/News";
import Box from "@/components/Box";
import NewsSummaryCard from "@/components/NewsSummaryCard";
import Tabs from "@/components/Tabs";
import { getReleaseByYear } from "@/utils/releaseNotes";

interface ContentProps {
    data: EventNode[] | NewsNode[];
}

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.newsEvents";

const Content = ({ data }: ContentProps) => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    const years = rangeRight(startYear, currentYear + 1).map(String);

    const generatedData = useMemo(() => {
        return years.map(year => {
            const dataByYear = getReleaseByYear(data, year);

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
                                {dataByYear.map(item => (
                                    <Grid
                                        item
                                        desktop={3}
                                        tablet={4}
                                        mobile={12}>
                                        <NewsSummaryCard
                                            summary={item.newsFields.text}
                                            imageLink={
                                                item.newsFields.image.node
                                                    .mediaItemUrl
                                            }
                                            imageAlt={
                                                item.newsFields.image.node
                                                    .altText
                                            }
                                            headline={item.newsFields.headline}
                                            date={item.newsFields.date}
                                            url={item.newsFields.link.url}
                                            buttonText={
                                                item.newsFields.link.title
                                            }
                                            key={item.newsFields.headline}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </div>
                ),
            };
        });
    }, [data]);

    return (
        <Tabs
            paramName="year"
            centered
            tabs={generatedData}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default Content;
