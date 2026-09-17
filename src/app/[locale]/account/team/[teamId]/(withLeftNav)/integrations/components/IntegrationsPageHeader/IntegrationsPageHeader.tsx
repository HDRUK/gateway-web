"use client";

import { Button } from "@hdruk/ui";
import Link from "next/link";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { AddIcon, DescriptionOutlinedIcon } from "@/consts/icons";

interface IntegrationsPageHeaderProps {
    title: string;
    howToLabel: string;
    howToHref: string;
    createLabel: string;
    createHref: string;
    showCreateButton: boolean;
    note?: string;
}

const IntegrationsPageHeader = ({
    title,
    howToLabel,
    howToHref,
    createLabel,
    createHref,
    showCreateButton,
    note,
}: IntegrationsPageHeaderProps) => {
    return (
        <Paper>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}>
                <Box sx={{ flexGrow: 1, p: 0 }}>
                    <Typography variant="h2">{title}</Typography>
                    <Button
                        component="a"
                        href={howToHref}
                        target="_blank"
                        rel="noopener"
                        purpose="link"
                        startIcon={<DescriptionOutlinedIcon />}>
                        {howToLabel}
                    </Button>
                    {note && <Typography>{note}</Typography>}
                </Box>

                {showCreateButton && (
                    <Button
                        component={Link}
                        href={createHref}
                        startIcon={<AddIcon />}>
                        {createLabel}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default IntegrationsPageHeader;
