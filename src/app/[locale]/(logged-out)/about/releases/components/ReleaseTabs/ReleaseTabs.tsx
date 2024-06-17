"use client";

import { useMemo, useState } from "react";
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

    const generatedReleases = useMemo(() => {
        return ["2024", "2023", "2022", "2021"].map(year => {
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

    console.log(generatedReleases);

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
