"use client";

import { useMemo, useState } from "react";
import { rangeRight } from "lodash";
import { useTranslations } from "next-intl";
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
    const [expanded, setExpanded] = useState<string | null>(null);
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);

    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : null);
    };

    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    const years = rangeRight(startYear, currentYear + 1).map(String);

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
                        {releases.map(release => (
                            <Accordion
                                key={release.date}
                                expanded={expanded === release.id}
                                heading={
                                    <Typography>{release.title}</Typography>
                                }
                                onChange={(event, isExpanded) =>
                                    handleChange(isExpanded, release.id)
                                }
                                contents={
                                    <HTMLContent content={release.content} />
                                }
                            />
                        ))}
                    </div>
                ),
            };
            return hydratedReleases;
        });
    }, [allReleases, expanded]);

    return (
        <Tabs
            centered
            introContent={<IntroContent />}
            tabs={generatedReleases}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default ReleaseTabs;
