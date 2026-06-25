"use client";

import Skeleton from "@mui/material/Skeleton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

export interface CountTile {
    key: string;
    label: string;
    count?: number;
}

interface CountTilesWidgetProps {
    title: string;
    loadingLabel: string;
    isLoading: boolean;
    items: CountTile[];
}

const CountTilesWidget = ({
    title,
    loadingLabel,
    isLoading,
    items,
}: CountTilesWidgetProps) => (
    <Paper sx={{ p: 2, height: "100%" }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
            {title}
        </Typography>
        {isLoading ? (
            <Box
                role="status"
                aria-label={loadingLabel}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 0,
                    m: 0,
                }}>
                {items.map(({ key }) => (
                    <Skeleton key={key} variant="rectangular" height={72} />
                ))}
            </Box>
        ) : (
            <Box
                component="dl"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    m: 0,
                    p: 0,
                }}>
                {items.map(({ key, label, count }) => (
                    <Box
                        key={key}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            bgcolor: colors.grey100,
                        }}>
                        <Typography component="dt">{label}</Typography>
                        <Typography variant="h1" component="dd" sx={{ m: 0 }}>
                            {(count ?? 0).toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Box>
        )}
    </Paper>
);

export default CountTilesWidget;
