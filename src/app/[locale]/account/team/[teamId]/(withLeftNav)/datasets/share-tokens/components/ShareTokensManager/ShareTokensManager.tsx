"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Loading } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import { ShareToken, ShareTokenStatus } from "@/interfaces/Collab";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    AddIcon,
    ArrowBackIosNewIcon,
    CalendarMonthOutlinedIcon,
    ContentCopyIcon,
    HistoryIcon,
    LaunchIcon,
    QueryBuilderOutlinedIcon,
    StorageOutlinedIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { formatDate } from "@/utils/date";

// Translation keys for the non-"active" statuses - "active" is handled
// separately below since it further splits into "awaiting" vs "ready for
// review" depending on ready_for_review_at.
const statusTranslationKey: Record<
    Exclude<ShareTokenStatus, "active">,
    "statusCompleted" | "revoked" | "statusExpired"
> = {
    completed: "statusCompleted",
    revoked: "revoked",
    expired: "statusExpired",
};

interface ShareTokensManagerProps {
    permissions: { [key: string]: boolean };
    teamId: string;
    /** False while the API won't mint links (schema-driven form off). */
    canCreateLinks?: boolean;
}

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.ShareTokensManager`;

const buildShareUrl = (token: string) =>
    `${
        typeof window !== "undefined" ? window.location.origin : ""
    }/collab/${token}`;

// "active" here just means "not revoked/completed/expired yet" - it covers
// both an untouched link and one a collaborator has already marked ready
// for review, which the chip below distinguishes with its own label.
const statusChipColor: Record<
    ShareTokenStatus,
    "info" | "success" | "default" | "warning"
> = {
    active: "info",
    completed: "success",
    revoked: "default",
    expired: "warning",
};

const ShareTokensManager = ({
    permissions,
    teamId,
    canCreateLinks = true,
}: ShareTokensManagerProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal, hideModal } = useModal();

    const baseUrl = `${apis.teamsV2Url}/${teamId}/datasets/share-tokens`;

    const { data: tokens, isLoading, mutate } = useGet<ShareToken[]>(baseUrl);

    const createToken = usePost<Record<string, never>>(baseUrl, {
        itemName: "Share link",
    });

    const revokeToken = useDelete(baseUrl, { itemName: "Share link" });

    const canCreate = canCreateLinks && !!permissions["datasets.create"];
    const canRevoke = !!permissions["datasets.delete"];

    const summary = useMemo(
        () =>
            (tokens || []).reduce(
                (acc, shareToken) => {
                    acc[shareToken.status] += 1;
                    if (
                        shareToken.status === "active" &&
                        shareToken.ready_for_review_at
                    ) {
                        acc.ready += 1;
                    }
                    return acc;
                },
                {
                    active: 0,
                    completed: 0,
                    revoked: 0,
                    expired: 0,
                    ready: 0,
                } as Record<ShareTokenStatus | "ready", number>
            ),
        [tokens]
    );

    // Each create mints a live link and a draft dataset, so ignore further
    // clicks until the request finishes.
    // The ref guards clicks in the same tick, before the disabled state renders.
    const [isCreating, setIsCreating] = useState(false);
    const creating = useRef(false);
    const handleCreate = async () => {
        if (creating.current) {
            return;
        }
        creating.current = true;
        setIsCreating(true);
        try {
            const created = await createToken({});

            if (created) {
                mutate();
            }
        } finally {
            creating.current = false;
            setIsCreating(false);
        }
    };

    const handleCopy = async (token: string) => {
        const shareUrl = buildShareUrl(token);

        try {
            await navigator.clipboard.writeText(shareUrl);
            notificationService.success(t("copiedToClipboard"));
        } catch {
            notificationService.error(t("copyFailed"));
        }
    };

    const handleRevoke = (id: number) => {
        showModal({
            title: t("revokeModal.title"),
            confirmText: t("revokeModal.confirmButton"),
            cancelText: t("revokeModal.cancelButton"),
            onSuccess: async () => {
                await revokeToken(id);
                mutate();
                hideModal();
            },
            onCancel: () => hideModal(),
        });
    };

    const statusLabel = (shareToken: ShareToken) => {
        if (shareToken.status === "active") {
            return shareToken.ready_for_review_at
                ? t("readyForReview")
                : t("statusActive");
        }

        return t(statusTranslationKey[shareToken.status]);
    };

    return (
        <Paper sx={{ p: 0, overflow: "hidden" }}>
            <Box
                sx={{
                    bgcolor: "white",
                    p: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                }}>
                <Box
                    sx={{
                        flexGrow: 1,
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                    <Link
                        href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`}
                        underline="hover"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ArrowBackIosNewIcon fontSize="small" />
                        {t("backToDatasets")}
                    </Link>
                    <Typography variant="h2" sx={{ mt: 0.5 }}>
                        {t("title")}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", maxWidth: 640 }}>
                        {t("text")}
                    </Typography>

                    {!!tokens?.length && (
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 1,
                            }}>
                            {summary.active - summary.ready > 0 && (
                                <Chip
                                    size="small"
                                    color="info"
                                    label={t("summaryActive", {
                                        count: summary.active - summary.ready,
                                    })}
                                />
                            )}
                            {summary.ready > 0 && (
                                <Chip
                                    size="small"
                                    color="success"
                                    label={t("summaryReady", {
                                        count: summary.ready,
                                    })}
                                />
                            )}
                            {summary.completed > 0 && (
                                <Chip
                                    size="small"
                                    color="success"
                                    label={t("summaryCompleted", {
                                        count: summary.completed,
                                    })}
                                />
                            )}
                            {summary.expired > 0 && (
                                <Chip
                                    size="small"
                                    color="warning"
                                    label={t("summaryExpired", {
                                        count: summary.expired,
                                    })}
                                />
                            )}
                            {summary.revoked > 0 && (
                                <Chip
                                    size="small"
                                    color="default"
                                    label={t("summaryRevoked", {
                                        count: summary.revoked,
                                    })}
                                />
                            )}
                        </Box>
                    )}
                </Box>

                {canCreate && (
                    <Button
                        data-testid="btn-create-share-token"
                        onClick={handleCreate}
                        disabled={isCreating}
                        startIcon={<AddIcon />}
                        sx={{ flexShrink: 0 }}>
                        {t("create")}
                    </Button>
                )}
            </Box>

            {isLoading && (
                <Box sx={{ p: 3 }}>
                    <Loading />
                </Box>
            )}

            {!isLoading && (!tokens || tokens.length === 0) && (
                <Box
                    sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        textAlign: "center",
                        borderTop: "1px solid",
                        borderColor: "divider",
                    }}>
                    <Typography sx={{ fontWeight: 600 }}>
                        {t("noTokens")}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                        {t("noTokensHint")}
                    </Typography>
                </Box>
            )}

            {tokens?.map(shareToken => {
                const isOpen = shareToken.status === "active";

                return (
                    <Box
                        key={shareToken.id}
                        data-testid="share-token-row"
                        sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            justifyContent: "space-between",
                            borderTop: "1px solid",
                            borderColor: "divider",
                            opacity: isOpen ? 1 : 0.85,
                            "&:hover": {
                                bgcolor: "grey.100",
                            },
                        }}>
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}>
                            <Link
                                data-testid="dataset-edit-link"
                                title={t("openDatasetTooltip")}
                                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}/${shareToken.dataset_id}`}
                                underline="hover"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontWeight: 600,
                                }}>
                                <StorageOutlinedIcon fontSize="small" />
                                {t("datasetId", { id: shareToken.dataset_id })}
                                <LaunchIcon
                                    sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                    }}
                                />
                            </Link>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    p: 0,
                                    color: "text.secondary",
                                }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        p: 0,
                                    }}>
                                    <CalendarMonthOutlinedIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                    <Typography fontSize={14}>
                                        {t("createdAt", {
                                            date:
                                                formatDate(
                                                    shareToken.created_at
                                                ) || "",
                                        })}
                                    </Typography>
                                </Box>
                                {shareToken.expires_at && isOpen && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            p: 0,
                                        }}>
                                        <QueryBuilderOutlinedIcon
                                            sx={{ fontSize: 16 }}
                                        />
                                        <Typography fontSize={14}>
                                            {t("expiresAt", {
                                                date:
                                                    formatDate(
                                                        shareToken.expires_at
                                                    ) || "",
                                            })}
                                        </Typography>
                                    </Box>
                                )}
                                {shareToken.last_submitted_at && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            p: 0,
                                        }}>
                                        <HistoryIcon sx={{ fontSize: 16 }} />
                                        <Typography fontSize={14}>
                                            {t("lastSubmittedAt", {
                                                date:
                                                    formatDate(
                                                        shareToken.last_submitted_at
                                                    ) || "",
                                            })}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                                <Chip
                                    size="small"
                                    label={statusLabel(shareToken)}
                                    color={statusChipColor[shareToken.status]}
                                />
                            </Box>

                            {isOpen && (
                                <Link
                                    data-testid="share-token-url"
                                    href={buildShareUrl(shareToken.token)}
                                    underline="hover"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: 13,
                                        wordBreak: "break-all",
                                        color: "text.secondary",
                                    }}>
                                    {buildShareUrl(shareToken.token)}
                                </Link>
                            )}
                        </Box>

                        {isOpen && (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    p: 0,
                                    flexShrink: 0,
                                    alignItems: "flex-start",
                                }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() =>
                                        handleCopy(shareToken.token)
                                    }>
                                    {t("copyLink")}
                                </Button>
                                {canRevoke && (
                                    <Button
                                        data-testid="btn-revoke-share-token"
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            handleRevoke(shareToken.id)
                                        }>
                                        {t("revoke")}
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Paper>
    );
};

export default ShareTokensManager;
