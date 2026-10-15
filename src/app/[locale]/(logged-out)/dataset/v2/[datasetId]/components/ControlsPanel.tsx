"use client";

import { ReactNode, useState } from "react";
import { tokens } from "@hdruk/ui/theme";
import { ButtonBase, Collapse } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { ChevronThinIcon } from "@/consts/customIcons";

export interface ControlsPanelProps {
    summary: string;
    children: ReactNode;
}

const ControlsPanel = ({ summary, children }: ControlsPanelProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                border: 1,
                borderColor: "greyCustom.main",
                borderRadius: `${tokens.radius.small}px`,
                bgcolor: "background.paper",
                p: 0,
                mb: 2,
            }}>
            <ButtonBase
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="live-metadata-controls"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    px: 2,
                    py: 1,
                    justifyContent: "flex-start",
                    textAlign: "left",
                }}>
                <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, fontFamily: "monospace" }}>
                    {summary}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {open ? "Hide" : "Change dataset or schema"}
                </Typography>
                <ChevronThinIcon
                    fontSize="small"
                    color="primary"
                    sx={{
                        transform: open ? "rotate(180deg)" : "none",
                        transition: "transform 150ms",
                    }}
                />
            </ButtonBase>

            <Collapse in={open} id="live-metadata-controls">
                <Box sx={{ px: 2, pb: 2, pt: 0 }}>{children}</Box>
            </Collapse>
        </Box>
    );
};

export default ControlsPanel;
