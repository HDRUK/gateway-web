"use client";

import { useMemo } from "react";
import { Divider, Skeleton, Switch } from "@mui/material";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { FeatureFlagsResponse } from "@/utils/gatewayFlagAdapter";

interface Feature {
    name: string;
    value: boolean;
}

export default function FeatureFlagsTable({ userId }: { userId?: string }) {
    const url = userId ? `${apis.features}/users/${userId}` : apis.features;

    const { data, isLoading, mutate } = useGet<FeatureFlagsResponse>(url);

    const features: Feature[] = useMemo(
        () =>
            Object.entries(data ?? []).map(([name, value]) => ({
                name,
                value,
            })),
        [data]
    );

    const toggle = usePut(url);

    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={40} />
            </Paper>
        );
    }

    if (features.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    No feature flags found.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper variant="outlined">
            {features.map((feature, index) => (
                <Box key={feature.name}>
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                        }}>
                        <Typography sx={{ wordBreak: "break-word" }}>
                            {feature.name}
                        </Typography>
                        <Switch
                            checked={!!feature.value}
                            onChange={() =>
                                toggle(feature.name, null).then(mutate)
                            }
                        />
                    </Box>
                    {index < features.length - 1 && <Divider />}
                </Box>
            ))}
        </Paper>
    );
}
