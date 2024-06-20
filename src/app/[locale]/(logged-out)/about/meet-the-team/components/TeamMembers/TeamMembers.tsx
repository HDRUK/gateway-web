"use client";

import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MeetTheTeamNode, TeamMember } from "@/interfaces/MeetTheTeam";
import BackButton from "@/components/BackButton";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import TeamModal from "../TeamModal";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Our mission and purpose",
    description: "",
};

interface TeamMembersProps {
    data: MeetTheTeamNode;
}

const TRANSLATIONS_NAMESPACE_TEAM_MEMBERS = "pages.about";

export default function TeamMembers({ data }: TeamMembersProps) {
    const { meetTheTeamRepeater, title } = data.node;
    const [activeTeamMember, setActiveTeamMember] = useState<TeamMember>();
    const t = useTranslations(TRANSLATIONS_NAMESPACE_TEAM_MEMBERS);
    const router = useRouter();

    const handleTeamMemberClick = (teamMember: TeamMember) => {
        setActiveTeamMember(teamMember);
    };

    const handleTeamModalCancel = () => {
        setActiveTeamMember(undefined);
    };

    const handleBackClick = () => {
        router.push("/");
    };

    const content = meetTheTeamRepeater.teamList?.map(teamMember => {
        const { name, jobTitle, image } = teamMember;

        return (
            <Grid
                item
                component="li"
                mobile={12}
                tablet={4}
                desktop={3}
                sx={{
                    "> div > img": { maxWidth: "250px", width: "100%" },
                }}>
                <Box
                    role="button"
                    onClick={() => handleTeamMemberClick(teamMember)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                    }}>
                    {image && (
                        <Box
                            component="img"
                            src={image.node.sourceUrl}
                            alt={image.node.altText}
                            sx={{
                                mb: 2,
                            }}
                        />
                    )}
                    <Typography variant="h3">{name}</Typography>
                    <Typography sx={{ mb: 0 }}>{jobTitle}</Typography>
                </Box>
            </Grid>
        );
    });

    return (
        <>
            <Banner title={title} />
            <Container sx={{ background: "white", px: 10, py: 3 }}>
                <BackButton
                    label={t("backToHomepage")}
                    onClick={handleBackClick}
                />
                <Typography sx={{ mb: 4 }}>
                    {meetTheTeamRepeater.summaryText}
                </Typography>
                <Grid
                    component="ul"
                    container
                    columnSpacing={4}
                    rowSpacing={4}
                    sx={{ listStyleType: "none", p: 0 }}>
                    {content}
                </Grid>
                {activeTeamMember && (
                    <TeamModal
                        teamMember={activeTeamMember}
                        onCancel={handleTeamModalCancel}
                    />
                )}
            </Container>
        </>
    );
}
