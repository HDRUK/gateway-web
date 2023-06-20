import Tabs from "@/components/Tabs";
import { useState } from "react";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import Accordion from "@/components/Accordion";
import { ReleaseNotesResponse } from "@/interfaces/Releases";

import { getReleaseByYear } from "@/utils/release-notes";

interface ReleaseTabProps {
    allReleases: ReleaseNotesResponse;
}

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

    const generatedReleases = () => {
        return ["2023", "2022", "2021", "2020"].map(year => {
            const releases = getReleaseByYear(allReleases, year);

            const hydratedReleases = {
                label: year,
                value: year,
                content: (
                    <div>
                        {!releases.length && <p>No releases for {year}</p>}
                        {releases?.map(release => (
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
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: release.content,
                                                }}
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
    };
    return (
        <Tabs
            centered
            value={selectedTab}
            onChange={handleTabChange}
            tabs={generatedReleases()}
        />
    );
};

export default ReleaseTabs;
