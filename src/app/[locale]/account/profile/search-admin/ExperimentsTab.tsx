"use client";

import { useMemo, useState } from "react";
import { Button } from "@hdruk/ui";
import { Chip, Divider, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import { AdminExperiment } from "@/interfaces/Experiment";
import ActionMenu from "@/components/ActionMenu";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { EditIcon, DeleteForeverIcon } from "@/consts/icons";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import DeleteExperimentDialog from "./DeleteExperimentDialog";
import ExperimentForm from "./ExperimentForm";

enum ViewMode {
    LIST = "list",
    CREATE = "create",
    EDIT = "edit",
}

type View =
    | { mode: ViewMode.LIST }
    | { mode: ViewMode.CREATE }
    | { mode: ViewMode.EDIT; experimentId: number };

const STATUS_COLOURS = {
    draft: "default",
    active: "success",
    paused: "warning",
    archived: "default",
} as const;

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function ExperimentsTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const [view, setView] = useState<View>({ mode: ViewMode.LIST });
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    const { data, isLoading, mutate } = useGet<AdminExperiment[]>(
        apis.experimentsV1Url
    );

    const experiments = useMemo(() => data ?? [], [data]);

    const backToList = () => {
        setView({ mode: ViewMode.LIST });
        mutate();
    };

    const handleDelete = (experiment: AdminExperiment) => {
        showDialog(DeleteExperimentDialog, {
            experimentId: experiment.id,
            experimentName: experiment.name,
            callback: mutate,
        });
    };

    if (view.mode !== ViewMode.LIST) {
        return (
            <ExperimentForm
                experimentId={
                    view.mode === ViewMode.EDIT ? view.experimentId : undefined
                }
                onDone={backToList}
                onCancel={() => setView({ mode: ViewMode.LIST })}
            />
        );
    }

    return (
        <Box sx={{ p: 0 }}>
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
                <Typography variant="h3">{t("experimentsTitle")}</Typography>
                <Button
                    size="small"
                    onClick={() => setView({ mode: ViewMode.CREATE })}>
                    {t("createExperiment")}
                </Button>
            </Box>

            {isLoading && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" height={40} />
                </Paper>
            )}

            {!isLoading && experiments.length === 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t("noExperimentsFound")}
                    </Typography>
                </Paper>
            )}

            {!isLoading && experiments.length > 0 && (
                <Paper variant="outlined">
                    {experiments.map((experiment, index) => (
                        <Box key={experiment.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}>
                                <Box sx={{ p: 0, minWidth: 0 }}>
                                    <Typography
                                        sx={{ wordBreak: "break-word" }}>
                                        {experiment.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ wordBreak: "break-word" }}>
                                        {experiment.targeting.paths.join(", ")}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {t("experimentResponses", {
                                            count:
                                                experiment.responses_count ?? 0,
                                        })}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color={
                                            STATUS_COLOURS[experiment.status]
                                        }
                                        label={t(
                                            `experimentStatus.${experiment.status}`
                                        )}
                                    />
                                    <ActionMenu
                                        actions={[
                                            {
                                                label: t("edit"),
                                                icon: EditIcon,
                                                action: () =>
                                                    setView({
                                                        mode: ViewMode.EDIT,
                                                        experimentId:
                                                            experiment.id,
                                                    }),
                                            },
                                            {
                                                label: t("delete"),
                                                icon: DeleteForeverIcon,
                                                action: () =>
                                                    handleDelete(experiment),
                                            },
                                        ]}
                                    />
                                </Box>
                            </Box>
                            {index < experiments.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
