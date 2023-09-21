import Tabs from "@/components/Tabs";
import { useMemo, useState } from "react";
import Typography from "@/components/Typography";
import Accordion from "@/components/Accordion";
import { ReleaseNode } from "@/interfaces/Releases";

import { getReleaseByYear } from "@/utils/release-notes";
import Box from "@/components/Box";
import HTMLContent from "@/components/HTMLContent";

interface ReleaseTabProps {
    allReleases: ReleaseNode[];
}

const IntroContent = () => (
    <Box
        sx={{
            bgcolor: "transparent",
            padding: {
                mobile: "20px 40px",
                tablet: "40px 100px 20px",
                desktop: "40px 120px 20px",
            },
        }}>
        <p>
            The Gateway requires a significant volume of design and development
            work to deliver our vision and ambition. To achieve this our teams
            are continually working on the Gateway and deliver major software
            releases approximately every 4 weeks.
        </p>
        <p>
            On this page we explain what new developments we are currently
            working on and list the major releases made since the Gateway was
            released in its current format in June 2020. Clicking on an entry
            provides further detail about the functionality that the particular
            release delivered.
        </p>
    </Box>
);

const ReleaseTabs = ({ allReleases }: ReleaseTabProps) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState("2023");

    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    const generatedReleases = useMemo(() => {
        return ["2023", "2022", "2021", "2020"].map(year => {
            const releases = getReleaseByYear(allReleases, year);

            const hydratedReleases = {
                label: year,
                value: year,
                content: (
                    <div>
                        {!releases.length && (
                            <p>There are no releases for {year}</p>
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
            value={selectedTab}
            onChange={handleTabChange}
            tabs={generatedReleases}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default ReleaseTabs;
