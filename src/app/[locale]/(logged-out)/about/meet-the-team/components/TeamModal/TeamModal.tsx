"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { TeamMember } from "@/interfaces/MeetTheTeam";
import useModal from "@/hooks/useModal";

interface TeamModalProps {
    teamMember: TeamMember;
    onCancel: () => void;
}

export default function TeamModal({ onCancel, teamMember }: TeamModalProps) {
    const { showModal } = useModal();

    useEffect(() => {
        showModal({
            content: (
                <Box sx={{ display: "flex", gap: 2 }}>
                    <img
                        src={teamMember.image.node.sourceUrl}
                        alt={teamMember.image.node.altText}
                    />
                    <div>
                        <Typography variant="h3" sx={{ mb: 2 }}>
                            {teamMember.name}
                        </Typography>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {teamMember.jobTitle}
                        </Typography>
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography>{teamMember.info}</Typography>
                    </div>
                </Box>
            ),
            showCancel: false,
            showConfirm: false,
            onCancel,
        });
    }, []);

    return null;
}
