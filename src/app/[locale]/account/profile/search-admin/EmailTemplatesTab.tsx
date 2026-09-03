"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Divider, Skeleton, Switch } from "@mui/material";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { Button } from "@hdruk/ui";
import ActionMenu from "@/components/ActionMenu";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { EditIcon, DeleteForeverIcon } from "@/consts/icons";
import { EmailTemplate } from "@/interfaces/EmailTemplate";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import EmailTemplateForm from "./EmailTemplateForm";
import DeleteEmailTemplateDialog from "./DeleteEmailTemplateDialog";

export enum ViewMode {
    LIST = "list",
    CREATE = "create",
    EDIT = "edit",
}

type View =
    | { mode: ViewMode.LIST }
    | { mode: ViewMode.CREATE }
    | { mode: ViewMode.EDIT; templateId: number };

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function EmailTemplatesTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const [view, setView] = useState<View>({ mode: ViewMode.LIST });
    const { showDialog } = useDialog() as GlobalDialogContextProps;

    const { data, isLoading, mutate } = useGet<EmailTemplate[]>(
        apis.emailTemplatesV1Url
    );

    const templates = useMemo(() => data ?? [], [data]);

    const toggleEnabled = usePatch<{ enabled: boolean }>(
        apis.emailTemplatesV1Url,
        { itemName: "Email Template" }
    );

    const handleToggle = (template: EmailTemplate) => {
        const nextEnabled = !template.enabled;
        const optimisticTemplates = templates.map(t =>
            t.id === template.id ? { ...t, enabled: nextEnabled } : t
        );

        mutate(
            async () => {
                const result = await toggleEnabled(template.id, {
                    enabled: nextEnabled,
                });

                return result ? optimisticTemplates : templates;
            },
            {
                optimisticData: optimisticTemplates,
                rollbackOnError: true,
                revalidate: false,
            }
        );
    };

    const handleDelete = (template: EmailTemplate) => {
        showDialog(DeleteEmailTemplateDialog, {
            templateId: template.id,
            templateIdentifier: template.identifier,
            callback: mutate,
        });
    };

    if (view.mode === ViewMode.CREATE) {
        return (
            <EmailTemplateForm
                onDone={() => {
                    setView({ mode: ViewMode.LIST });
                    mutate();
                }}
                onCancel={() => setView({ mode: ViewMode.LIST })}
            />
        );
    }

    if (view.mode === ViewMode.EDIT) {
        return (
            <EmailTemplateForm
                templateId={view.templateId}
                onDone={() => {
                    setView({ mode: ViewMode.LIST });
                    mutate();
                }}
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
                <Typography variant="h3">{t("emailTemplatesTitle")}</Typography>
                <Button
                    size="small"
                    onClick={() => setView({ mode: ViewMode.CREATE })}>
                    {t("createEmailTemplate")}
                </Button>
            </Box>

            {isLoading && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" height={40} />
                </Paper>
            )}

            {!isLoading && templates.length === 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t("noEmailTemplatesFound")}
                    </Typography>
                </Paper>
            )}

            {!isLoading && templates.length > 0 && (
                <Paper variant="outlined">
                    {templates.map((template, index) => (
                        <Box key={template.id}>
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
                                        {template.identifier}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ wordBreak: "break-word" }}>
                                        {template.subject}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}>
                                    <Switch
                                        checked={template.enabled}
                                        onChange={() =>
                                            handleToggle(template)
                                        }
                                        slotProps={{
                                            input: {
                                                "aria-label": t(
                                                    "toggleEmailTemplateEnabled",
                                                    {
                                                        IDENTIFIER:
                                                            template.identifier,
                                                    }
                                                ),
                                            },
                                        }}
                                    />
                                    <ActionMenu
                                        actions={[
                                            {
                                                label: t("edit"),
                                                icon: EditIcon,
                                                action: () =>
                                                    setView({
                                                        mode: ViewMode.EDIT,
                                                        templateId:
                                                            template.id,
                                                    }),
                                            },
                                            {
                                                label: t("delete"),
                                                icon: DeleteForeverIcon,
                                                action: () =>
                                                    handleDelete(template),
                                            },
                                        ]}
                                    />
                                </Box>
                            </Box>
                            {index < templates.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
