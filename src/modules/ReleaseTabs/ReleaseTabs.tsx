import Tabs from "@/components/Tabs";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import Accordion from "@/components/Accordion";
import { ReleaseNode } from "@/interfaces/Releases";

import { getReleaseByYear } from "@/utils/release-notes";
import WPContent from "@/components/WPContent";
import Box from "@/components/Box";

interface ReleaseTabProps {
    allReleases: ReleaseNode[];
}

const IntroContent = () => (
    <Box>
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
    const theme = useTheme();
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
                            <div key={release.date}>
                                <Accordion
                                    expanded={expanded === release.id}
                                    heading={
                                        <Typography>{release.title}</Typography>
                                    }
                                    onChange={(event, isExpanded) =>
                                        handleChange(isExpanded, release.id)
                                    }
                                    contents={
                                        <>
                                            <Typography
                                                color={
                                                    theme.palette.colors.grey500
                                                }>
                                                {format(
                                                    new Date(release.date),
                                                    "MM/dd/yyyy"
                                                )}
                                            </Typography>
                                            <WPContent
                                                content={release.content}
                                            />
                                        </>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ),
            };
            return hydratedReleases;
        });
    }, [allReleases, expanded, theme.palette.colors.grey500]);

    return (
        <Tabs
            centered
            introContent={<IntroContent />}
            value={selectedTab}
            onChange={handleTabChange}
            tabs={generatedReleases}
            tabBoxSx={{ paddingTop: 0 }}
            rootBoxSx={{ paddingTop: 0 }}
        />
    );
};

export default ReleaseTabs;
