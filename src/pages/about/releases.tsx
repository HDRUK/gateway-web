import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import Container from "@/components/Container";
import { getReleaseNotes } from "@/utils/cms";
import { getYear, format } from "date-fns";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import Accordion from "@/components/Accordion";
import { ReleaseNotesResponse } from "@/interfaces/Releases";

interface ReleasesProps {
    allReleases: ReleaseNotesResponse;
}

const Releases = ({ allReleases }: ReleasesProps) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState("2023");

    const getReleaseByYear = (releases, year) => {
        if (!releases) return;
        return releases
            .map(release => release.node)
            .filter(release => {
                const releaseYear = getYear(new Date(release.date)).toString();
                return releaseYear === year;
            });
    };

    const handleChange = (isExpanded: boolean, panel: string) => {
        console.log("isExpanded: ", isExpanded);
        console.log("panel: ", panel);
        setExpanded(isExpanded ? panel : null);
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

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - About - Releases" />
            <Container sx={{ background: "white" }}>
                <Tabs
                    centered
                    value={selectedTab}
                    onChange={handleTabChange}
                    tabs={generatedReleases()}
                />
            </Container>
        </>
    );
};

export const getStaticProps = async () => {
    const allReleases = await getReleaseNotes();

    return {
        props: { allReleases, ...(await loadServerSideLocales()) },
        revalidate: 10,
    };
};

export default Releases;
