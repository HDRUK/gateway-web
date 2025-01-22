"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { rangeRight } from "lodash";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ReleaseNode } from "@/interfaces/Releases";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import HTMLContent from "@/components/HTMLContent";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import { getReleaseByYear } from "@/utils/releaseNotes";
import IntroContent from "../IntroContent";

interface ReleaseTabProps {
    allReleases: ReleaseNode[];
}

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.releases";

const ReleaseTabs = ({ allReleases }: ReleaseTabProps) => {
    const searchParams = useSearchParams();
    const [expanded, setExpanded] = useState<string | null>(null);
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    const currentYear = dayjs().year();
    const years = rangeRight(2024, currentYear + 1).map(String);

    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : null);
    };

    const generatedReleases = useMemo(() => {
        return years.map(year => {
            const releases = getReleaseByYear(allReleases, year);

            const hydratedReleases = {
                label: year,
                value: year,
                content: (
                    <div>
                        {!releases.length && (
                            <Box component="p" sx={{ px: 2 }}>
                                {t("noResults", {
                                    year,
                                })}
                            </Box>
                        )}
                        {releases.map((release, index) => (
                            <Accordion
                                key={release.date}
                                defaultExpanded={
                                    expanded === release.id || index === 0
                                }
                                heading={
                                    <Typography>{release.title}</Typography>
                                }
                                onChange={(event, isExpanded) =>
                                    handleChange(isExpanded, release.id)
                                }
                                contents={
                                    <HTMLContent content={release.content} />
                                }
                                iconLeft
                            />
                        ))}
                    </div>
                ),
            };
            return hydratedReleases;
        });
    }, [allReleases, expanded, years]);

    return (
        <Tabs
            centered
            introContent={<IntroContent />}
            tabs={generatedReleases}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
            defaultSelectedTab={
                searchParams?.get("year") || currentYear.toString()
            }
        />
    );
};

export default ReleaseTabs;
