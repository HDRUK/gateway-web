"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { TeamMember } from "@/interfaces/MeetTheTeam";
import useModal from "@/hooks/useModal";

interface TeamModalProps {
    teamMember: TeamMember;
    onCancel: () => void;
}

const TRANSLATIONS_NAMESPACE_TEAM_MODAL = "components.TeamModal";

export default function TeamModal({ onCancel, teamMember }: TeamModalProps) {
    const { showModal } = useModal();
    const t = useTranslations(TRANSLATIONS_NAMESPACE_TEAM_MODAL);
    useEffect(() => {
        showModal({
            content: (
                <Box sx={{ display: "flex", gap: 2 }}>
                    <div>
                        <Box
                            component="img"
                            src={teamMember.image.node.sourceUrl}
                            alt={teamMember.image.node.altText}
                            sx={{ width: "200px" }}
                        />
                    </div>
                    <div>
                        <Typography variant="h3" sx={{ mb: 2 }}>
                            {teamMember.name}
                        </Typography>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {teamMember.jobTitle}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t("descriptionTitle")}
                        </Typography>
                        <Typography>{teamMember.info}</Typography>
                    </div>
                </Box>
            ),
            showCancel: false,
            showConfirm: false,
            onCancel,
        });
    }, [
        onCancel,
        showModal,
        t,
        teamMember,
        teamMember.image.node.sourceUrl,
        teamMember.image.node.altText,
        teamMember.info,
        teamMember.name,
        teamMember.jobTitle,
    ]);

    return null;
}
