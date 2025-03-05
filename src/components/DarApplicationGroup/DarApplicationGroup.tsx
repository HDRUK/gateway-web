"use client";

import { useState } from "react";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import DarApplicationCard from "@/components/DarApplicationCard";
import Paper from "@/components/Paper";
import ShowMore from "@/components/ShowMore";
import { colors } from "@/config/theme";
import { ArrowDropDownIcon } from "@/consts/icons";

const TRANSLATION_PATH =
    "pages.account.profile.dataAccessRequests.applications";

interface DarApplicationGroupProps {
    item: DataAccessRequestApplication;
}

export default function DarApplicationGroup({
    item,
}: DarApplicationGroupProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const [expanded, setExpanded] = useState<string[]>([]);

    return (
        <Paper
            sx={{
                mb: 1,
                p: 4,
                pb: 1,
                transition: "background-color 0.1s ease-in",
                ...(expanded.includes(item.id) && {
                    backgroundColor: colors.grey300,
                }),
            }}>
            <Box>
                <Typography
                    variant="h2"
                    color={colors.purple500}
                    fontSize={32}
                    fontWeight={600}>
                    {t("darApplication")}
                    {item.id}
                </Typography>
                <ShowMore maxHeight={24}>
                    <Typography fontSize={16}>{item.project_title}</Typography>
                </ShowMore>
                <Typography
                    color={colors.purple500}
                    fontWeight={700}
                    sx={{ mt: 2 }}>
                    {t("applicationsInGroup")}
                    <Typography
                        component="span"
                        sx={{
                            ml: 1,
                            color: colors.black,
                            fontWeight: 600,
                        }}>
                        {item.teams.length}
                    </Typography>
                </Typography>

                <Accordion
                    variant="plain"
                    noIndent
                    heading={""}
                    expandIcon={ArrowDropDownIcon}
                    contents={item.teams?.map((team, index) => (
                        <DarApplicationCard
                            application={item}
                            key={`${team.id}_${item.appliciation_id}`}
                            teamIndex={index}
                        />
                    ))}
                    onChange={() =>
                        setExpanded(
                            expanded.includes(item.id)
                                ? expanded.filter(e => e !== item.id)
                                : [...expanded, item.id]
                        )
                    }
                    expanded={expanded.includes(item.id)}
                />
            </Box>
        </Paper>
    );
}
