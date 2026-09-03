"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Divider, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import {
    ReassignEntityType,
    Reassignment,
    TransferAndDeletePayload,
    UserDeletionCheck,
    UserPickerOption,
} from "@/interfaces/AdminUser";
import { ValueType } from "@/components/Autocomplete/Autocomplete";
import Accordion from "@/components/Accordion";
import Autocomplete from "@/components/Autocomplete";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import notificationService from "@/services/notification";

const TRANSLATION_PATH = "modules.dialogs.DeleteUserDialog";

interface DeleteUserDialogProps {
    userId: number;
    userName: string;
    onDeleted: (userId: number) => void;
}

interface LinkedRow {
    key: string;
    entityType: ReassignEntityType;
    entityId: number;
    label: string;
    canDelete: boolean;
    canReassign: boolean;
}

type RowMode = "reassign" | "delete" | "";

interface RowResolution {
    mode: RowMode;
    newUserId?: number;
}

interface GroupConfig {
    field: keyof UserDeletionCheck;
    entityType: ReassignEntityType;
    groupLabel: string;
    getLabel: (item: { id: number; [key: string]: unknown }) => string;
}

const GROUPS: GroupConfig[] = [
    {
        field: "datasets",
        entityType: "dataset",
        groupLabel: "Datasets",
        getLabel: item => (item.title as string) ?? `#${item.id}`,
    },
    {
        field: "tools",
        entityType: "tool",
        groupLabel: "Analysis Scripts & Software",
        getLabel: item => (item.name as string) ?? `#${item.id}`,
    },
    {
        field: "applications",
        entityType: "application",
        groupLabel: "Applications",
        getLabel: item => (item.name as string) ?? `#${item.id}`,
    },
    {
        field: "reviews",
        entityType: "review",
        groupLabel: "Reviews",
        getLabel: item => (item.review_text as string) ?? `#${item.id}`,
    },
    {
        field: "cohort_requests",
        entityType: "cohort_request",
        groupLabel: "Cohort Discovery requests",
        getLabel: item => `#${item.id}`,
    },
    {
        field: "enquiry_threads",
        entityType: "enquiry_thread",
        groupLabel: "Enquiry threads",
        getLabel: item => (item.project_title as string) ?? `#${item.id}`,
    },
    {
        field: "collections",
        entityType: "collection",
        groupLabel: "Collections",
        getLabel: item => (item.name as string) ?? `#${item.id}`,
    },
];

interface DeleteUserDialogRowProps {
    row: LinkedRow;
    userOptions: { value: ValueType; label: string }[];
    isLoadingUsers: boolean;
    resolution: RowResolution | undefined;
    onChange: (key: string, resolution: RowResolution | undefined) => void;
}

const DeleteUserDialogRow = ({
    row,
    userOptions,
    isLoadingUsers,
    resolution,
    onChange,
}: DeleteUserDialogRowProps) => {
    const [mode, setMode] = useState<RowMode>(resolution?.mode ?? "");
    const { control } = useForm<{ newUserId?: number }>({
        defaultValues: { newUserId: resolution?.newUserId },
    });
    const newUserId = useWatch({ control, name: "newUserId" });

    useEffect(() => {
        if (mode === "delete") {
            onChange(row.key, { mode: "delete" });
        } else if (mode === "reassign") {
            onChange(row.key, {
                mode: "reassign",
                newUserId: (newUserId as unknown as number) || undefined,
            });
        } else {
            onChange(row.key, undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, newUserId]);

    return (
        <Box sx={{ p: 0, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600 }}>{row.label}</Typography>
            <RadioGroup
                row
                value={mode}
                onChange={(_, value) => setMode(value as RowMode)}>
                {row.canReassign && (
                    <FormControlLabel
                        value="reassign"
                        control={<Radio size="small" />}
                        label="Reassign to..."
                    />
                )}
                {row.canDelete && (
                    <FormControlLabel
                        value="delete"
                        control={<Radio size="small" />}
                        label="Delete this item"
                    />
                )}
            </RadioGroup>
            {mode === "reassign" && (
                <Autocomplete
                    label="New owner"
                    name="newUserId"
                    control={control}
                    options={userOptions}
                    isLoadingOptions={isLoadingUsers}
                    noOptionsText="No users found"
                    required
                />
            )}
        </Box>
    );
};

const DeleteUserDialog = ({
    userId,
    userName,
    onDeleted,
}: DeleteUserDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const [resolutions, setResolutions] = useState<
        Record<string, RowResolution | undefined>
    >({});
    const [submitting, setSubmitting] = useState(false);

    const { data, isLoading } = useGet<UserDeletionCheck>(
        `${apis.adminUsersV1Url}/${userId}/deletion-check`
    );

    const { data: users = [], isLoading: isLoadingUsers } = useGet<
        UserPickerOption[]
    >(`${apis.adminUsersV1Url}/picker`);

    const transferAndDelete = usePost<TransferAndDeletePayload>(
        `${apis.adminUsersV1Url}/${userId}/transfer-and-delete`,
        { successNotificationsOn: false }
    );

    const rows = useMemo<LinkedRow[]>(() => {
        if (!data) return [];

        return GROUPS.flatMap(group => {
            const items =
                (data[
                    group.field
                ] as unknown as { id: number; [key: string]: unknown }[]) ||
                [];

            return items.map(item => ({
                key: `${group.entityType}-${item.id}`,
                entityType: group.entityType,
                entityId: item.id,
                label: group.getLabel(item),
                // A Dataset is too heavily linked (versions, DAR
                // applications, collections, DURs, tools) to safely
                // hard-delete - the API rejects delete:true for it, so it
                // must always be reassigned instead.
                canDelete: group.entityType !== "dataset",
                // A Cohort Discovery request is inherently tied to the
                // specific user who submitted it - the API rejects
                // new_user_id for it, so it must always be deleted instead.
                canReassign: group.entityType !== "cohort_request",
            }));
        });
    }, [data]);

    const userOptions = useMemo(
        () =>
            (users || [])
                .filter(u => u.id !== userId)
                .map(u => {
                    const fullName =
                        u.firstname && u.lastname
                            ? `${u.firstname} ${u.lastname}`
                            : u.name;

                    const teamNames = (u.teams || []).map(team => team.name);
                    const teamSuffix =
                        teamNames.length > 2
                            ? `${teamNames.slice(0, 2).join(", ")}, +${teamNames.length - 2} more`
                            : teamNames.join(", ");

                    return {
                        value: u.id,
                        label: teamSuffix
                            ? `${fullName} (${teamSuffix})`
                            : fullName,
                    };
                })
                .sort((a, b) => a.label.localeCompare(b.label)),
        [users, userId]
    );

    const groupedRows = useMemo(
        () =>
            GROUPS.map(group => ({
                groupLabel: group.groupLabel,
                entityType: group.entityType,
                items: rows.filter(row => row.entityType === group.entityType),
            })).filter(group => group.items.length > 0),
        [rows]
    );

    const hasLinkedEntities = rows.length > 0;

    const allResolved = useMemo(
        () =>
            rows.every(row => {
                const resolution = resolutions[row.key];
                if (!resolution) return false;
                if (resolution.mode === "delete") return true;
                return resolution.mode === "reassign" && !!resolution.newUserId;
            }),
        [rows, resolutions]
    );

    const handleRowChange = (
        key: string,
        resolution: RowResolution | undefined
    ) => {
        setResolutions(prev => ({ ...prev, [key]: resolution }));
    };

    const onCancel = () => hideDialog();

    const handleConfirm = async () => {
        const reassignments: Reassignment[] = rows.map(row => {
            const resolution = resolutions[row.key];

            if (resolution?.mode === "delete") {
                return {
                    entity_type: row.entityType,
                    entity_id: row.entityId,
                    delete: true,
                };
            }

            return {
                entity_type: row.entityType,
                entity_id: row.entityId,
                new_user_id: resolution?.newUserId as number,
            };
        });

        setSubmitting(true);
        const result = await transferAndDelete({ reassignments });
        setSubmitting(false);

        if (result !== null) {
            notificationService.success(
                `${userName} was permanently deleted`
            );
            hideDialog();
            onDeleted(userId);
        }
    };

    const isConfirmDisabled =
        isLoading || submitting || (hasLinkedEntities && !allResolved);

    return (
        <Dialog
            title={t("title")}
            showCloseButton={false}
            maxWidth={hasLinkedEntities ? "md" : "sm"}>
            <MuiDialogContent>
                {isLoading && <Loading />}
                {!isLoading && (
                    <>
                        <Typography sx={{ mb: 2, fontWeight: 600 }}>
                            {t("warning", { USER_NAME: userName })}
                        </Typography>

                        {!hasLinkedEntities && (
                            <Typography>{t("noLinkedData")}</Typography>
                        )}

                        {hasLinkedEntities && (
                            <>
                                <Typography sx={{ mb: 2 }}>
                                    {t("linkedDataIntro")}
                                </Typography>
                                {groupedRows.map(group => (
                                    <Box
                                        key={group.entityType}
                                        sx={{
                                            p: 0,
                                            mb: 1.5,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 1,
                                            overflow: "hidden",
                                        }}>
                                        <Accordion
                                            defaultExpanded
                                            variant="plain"
                                            sx={{
                                                ".MuiAccordionSummary-root": {
                                                    backgroundColor:
                                                        tokens.brand.primary,
                                                },
                                                ".MuiAccordionSummary-root .MuiSvgIcon-root":
                                                    {
                                                        color: "#fff",
                                                    },
                                                ".MuiAccordionDetails-root": {
                                                    px: 2,
                                                },
                                            }}
                                            heading={
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        textTransform:
                                                            "uppercase",
                                                        fontSize: "0.8rem",
                                                        letterSpacing:
                                                            "0.03em",
                                                        color: "#fff",
                                                    }}>
                                                    {group.groupLabel} (
                                                    {group.items.length})
                                                </Typography>
                                            }
                                            contents={group.items.map(
                                                (row, index) => (
                                                    <Box
                                                        key={row.key}
                                                        sx={{ p: 0 }}>
                                                        <DeleteUserDialogRow
                                                            row={row}
                                                            userOptions={
                                                                userOptions
                                                            }
                                                            isLoadingUsers={
                                                                isLoadingUsers
                                                            }
                                                            resolution={
                                                                resolutions[
                                                                    row.key
                                                                ]
                                                            }
                                                            onChange={
                                                                handleRowChange
                                                            }
                                                        />
                                                        {index <
                                                            group.items
                                                                .length -
                                                                1 && (
                                                            <Divider />
                                                        )}
                                                    </Box>
                                                )
                                            )}
                                        />
                                    </Box>
                                ))}
                            </>
                        )}
                    </>
                )}
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    autoFocus
                    color="secondary"
                    onClick={onCancel}>
                    {t("cancelButton")}
                </Button>
                <Button
                    color="error"
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}>
                    {t("confirmButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;
