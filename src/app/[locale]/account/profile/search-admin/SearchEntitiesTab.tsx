"use client";

import { useMemo } from "react";
import { Alert, Skeleton } from "@mui/material";
import { KeyedMutator } from "swr";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import useDialog from "@/hooks/useDialog";
import { AdminSearchStatusResponse } from "@/interfaces/AdminSearch";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import ReindexConfirmDialog from "./ReindexConfirmDialog";

// Rough eligible-document threshold above which a full drop+reimport is
// slow enough to warrant flagging before the admin clicks Reindex (datasets/
// dur/publications routinely run into the thousands with heavy per-row
// payloads, unlike e.g. data_custodian_networks).
const LARGE_ENTITY_THRESHOLD = 1000;

interface SearchEntitiesTabProps {
    data: AdminSearchStatusResponse | undefined;
    isLoading: boolean;
    mutate: KeyedMutator<AdminSearchStatusResponse | undefined>;
}

export default function SearchEntitiesTab({
    data,
    isLoading,
    mutate,
}: SearchEntitiesTabProps) {
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    const entities = useMemo(() => data?.entities ?? [], [data]);

    const handleReindex = (
        entity: string,
        collection: string,
        isLarge: boolean
    ) => {
        showDialog(ReindexConfirmDialog, {
            entity,
            collection,
            isLarge,
            callback: mutate,
        });
    };

    return (
        <Box sx={{ p: 0 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
                Reindexing drops and recreates a collection from scratch.
                Small entities finish in seconds, but larger ones (datasets,
                data use register, publications) can take a minute or two to
                fully re-import — this page won&apos;t update automatically,
                so use Refresh status to check progress.
            </Alert>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    p: 0,
                    mb: 2,
                }}>
                <Typography variant="h3">Search entities</Typography>
                <Button size="small" variant="outlined" onClick={() => mutate()}>
                    Refresh status
                </Button>
            </Box>

            <Box
                sx={{
                    p: 0,
                    display: "grid",
                    gridTemplateColumns: {
                        mobile: "1fr",
                        tablet: "repeat(2, 1fr)",
                        desktop: "repeat(3, 1fr)",
                    },
                    gap: 2,
                }}>
                {isLoading &&
                    Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" height={220} />
                    ))}

                {!isLoading &&
                    entities.map(row => {
                        const inSync =
                            row.collectionExists &&
                            row.documentCount === row.eligibleCount;
                        const facetFields = row.facetFields
                            ? row.facetFields
                                  .split(",")
                                  .map(field => field.trim())
                                  .filter(Boolean)
                            : [];
                        const isLarge =
                            row.eligibleCount > LARGE_ENTITY_THRESHOLD;

                        return (
                            <Paper
                                key={row.entity}
                                variant="outlined"
                                sx={{
                                    p: 0,
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: 0,
                                }}>
                                <Box
                                    sx={{
                                        p: 0,
                                        px: 2,
                                        py: 1.5,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 1,
                                        bgcolor: "primary.main",
                                    }}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: "common.white",
                                            wordBreak: "break-word",
                                        }}>
                                        {row.entity}
                                    </Typography>
                                    <Chip
                                        label={
                                            row.collectionExists
                                                ? "Exists"
                                                : "Missing"
                                        }
                                        color={
                                            row.collectionExists
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        flexGrow: 1,
                                    }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ wordBreak: "break-word" }}>
                                        Collection: {row.collection}
                                    </Typography>

                                    <Box
                                        sx={{
                                            p: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}>
                                        <Typography variant="body2">
                                            {row.documentCount} indexed /{" "}
                                            {row.eligibleCount} eligible
                                        </Typography>
                                        <Chip
                                            label={
                                                inSync
                                                    ? "In sync"
                                                    : "Needs reindex"
                                            }
                                            color={
                                                inSync ? "success" : "warning"
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {row.databaseCount} rows in DB total
                                    </Typography>

                                    <Box sx={{ p: 0 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5 }}>
                                            Facet fields
                                        </Typography>
                                        {facetFields.length > 0 ? (
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5,
                                                }}>
                                                {facetFields.map(field => (
                                                    <Chip
                                                        key={field}
                                                        label={field}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary">
                                                None configured
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ p: 0, mt: "auto", pt: 1 }}>
                                        {isLarge && (
                                            <Typography
                                                variant="body2"
                                                color="warning.main"
                                                sx={{ mb: 1 }}>
                                                Large entity — reindexing can
                                                take a minute or two.
                                            </Typography>
                                        )}
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            onClick={() =>
                                                handleReindex(
                                                    row.entity,
                                                    row.collection,
                                                    isLarge
                                                )
                                            }>
                                            Reindex
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })}
            </Box>
        </Box>
    );
}
