"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TeamMember } from "@/interfaces/MeetTheTeam";
import BackButton from "@/components/BackButton";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import TeamModal from "../TeamModal";

interface TeamMembersProps {
    title: string;
    data: {
        summaryText: string;
        teamList: TeamMember[];
    };
}

const TRANSLATIONS_NAMESPACE_TEAM_MEMBERS = "pages.about";

export default function TeamMembers({ title, data }: TeamMembersProps) {
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

    const content = data.teamList?.map(teamMember => {
        const { name, jobTitle, image } = teamMember;

        return (
            <Box
                component="li"
                sx={{
                    width: "200px",
                    minWidth: "150px",
                }}>
                <Box
                    role="button"
                    onClick={() => handleTeamMemberClick(teamMember)}
                    sx={{
                        cursor: "pointer",
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                        "&:hover:before": {
                            background: grey["100"],
                            content: '""',
                            position: "absolute",
                            top: "-8px",
                            left: "-8px",
                            bottom: "-8px",
                            right: "-8px",
                            boxShadow: 3,
                            borderRadius: 1,
                        },
                    }}>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            zIndex: 1,
                        }}>
                        {image && (
                            <Box
                                component="img"
                                src={image.node.sourceUrl}
                                alt={image.node.altText}
                                sx={{ width: "100%", maxWidth: "200px" }}
                            />
                        )}
                        <div>
                            <Typography variant="h3">{name}</Typography>
                            <EllipsisLineLimit text={jobTitle} maxLine={4} />
                        </div>
                    </Box>
                </Box>
            </Box>
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
                <Typography sx={{ mb: 4 }}>{data.summaryText}</Typography>
                <Box
                    component="ul"
                    sx={{
                        listStyleType: "none",
                        p: 0,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                    }}>
                    {content}
                </Box>
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
