"use client";

import { Box, Link, List, ListItem, ListItemText } from "@mui/material";
import { DatasetItem } from "@/interfaces/Widget";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { FULL_GATEWAY_URL } from "@/consts/urls";
import { formatPopulationSize } from "../utils/formatPopulationSize";
import { formatYearRange } from "../utils/formatYearRange";

const TRANSLATIONS = {
    populationSize: "Dataset population size",
    dateRange: "Date range",
    noData: "not reported",
    notAvailable: "n/a",
};

type DatasetsListProps = { items: DatasetItem[] };

export default function DatasetsList({ items }: DatasetsListProps) {
    return (
        <List
            sx={{
                background: colors.grey100,
                px: 1,
                mt: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
            }}>
            {items.map(result => (
                <ListItem
                    key={result.id}
                    sx={{
                        p: 0,
                        mb: 1,
                        borderBottom: `1px solid ${colors.grey300}`,
                        background: colors.white,
                    }}>
                    <ListItemText
                        disableTypography
                        sx={{ p: 2, pb: 1, m: 0 }}
                        primary={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1.5,
                                }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                    <Link
                                        href={`${FULL_GATEWAY_URL}/${RouteName.DATASET_ITEM}/${result.id}`}
                                        fontSize={16}
                                        fontWeight={600}
                                        mb={0.5}
                                        target="_blank">
                                        {result.short_title}
                                    </Link>
                                    {result.publisher && (
                                        <Link
                                            href={`${FULL_GATEWAY_URL}/${RouteName.DATA_CUSTODIANS_ITEM}/${result.team_id}`}
                                            target="_blank">
                                            <Typography sx={{ mb: 1.5 }}>
                                                {result.publisher}
                                            </Typography>
                                        </Link>
                                    )}
                                </Box>
                            </Box>
                        }
                        secondary={
                            <section aria-describedby={`${result.id}`}>
                                {result.description && (
                                    <Box sx={{ p: 0, mb: 2 }}>
                                        <EllipsisLineLimit
                                            text={result.description}
                                            maxLine={2}
                                        />
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        flexDirection: {
                                            mobile: "column",
                                            tablet: "row",
                                        },
                                        justifyContent: "space-between",
                                    }}>
                                    <Typography color={colors.green700}>
                                        {`${TRANSLATIONS.populationSize}: `}
                                        {formatPopulationSize(
                                            result.population_size,
                                            TRANSLATIONS.noData
                                        )}
                                    </Typography>
                                    <Typography color={colors.green700}>
                                        {`${TRANSLATIONS.dateRange}: `}
                                        {formatYearRange(
                                            result.start_date ?? null,
                                            result.end_date ?? null,
                                            TRANSLATIONS.notAvailable
                                        )}
                                    </Typography>
                                </Box>
                            </section>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
