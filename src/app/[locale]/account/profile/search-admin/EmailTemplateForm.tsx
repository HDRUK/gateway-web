"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Skeleton } from "@mui/material";
import { EmailTemplateFormValues, EmailTemplate } from "@/interfaces/EmailTemplate";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import {
    emailTemplateDefaultValues,
    emailTemplateEnabledField,
    emailTemplateFormFields,
    emailTemplateValidationSchema,
} from "@/config/forms/emailTemplate";

interface EmailTemplateFormProps {
    templateId?: number;
    onDone: () => void;
    onCancel: () => void;
}

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function EmailTemplateForm({
    templateId,
    onDone,
    onCancel,
}: EmailTemplateFormProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const isEditing = !!templateId;
    const [isSaving, setIsSaving] = useState(false);

    const { data: existingTemplate, isLoading: isLoadingTemplate } =
        useGet<EmailTemplate>(
            isEditing ? `${apis.emailTemplatesV1Url}/${templateId}` : null
        );

    const methods = useForm<EmailTemplateFormValues>({
        mode: "onTouched",
        resolver: yupResolver(emailTemplateValidationSchema),
        defaultValues: emailTemplateDefaultValues,
    });

    const { control, handleSubmit, reset } = methods;

    useEffect(() => {
        if (!existingTemplate) return;

        reset({
            identifier: existingTemplate.identifier,
            subject: existingTemplate.subject,
            body: existingTemplate.body,
            enabled: existingTemplate.enabled,
        });
    }, [existingTemplate, reset]);

    const createTemplate = usePost<EmailTemplateFormValues>(
        apis.emailTemplatesV1Url,
        { itemName: "Email Template" }
    );

    const editTemplate = usePut<EmailTemplateFormValues>(
        apis.emailTemplatesV1Url,
        { itemName: "Email Template" }
    );

    const submitForm = async (formData: EmailTemplateFormValues) => {
        if (isSaving) return;

        setIsSaving(true);

        const result = isEditing
            ? await editTemplate(templateId as number, formData)
            : await createTemplate(formData);

        setIsSaving(false);

        if (result) {
            onDone();
        }
    };

    const bodyValue = useWatch({ control, name: "body" });
    const debouncedBody = useDebounce(bodyValue ?? "", 600, 0);

    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewFailed, setPreviewFailed] = useState(false);

    const renderPreview = usePost<{ body: string }>(
        apis.emailTemplatesPreviewV1Url,
        { successNotificationsOn: false, errorNotificationsOn: false }
    );

    const previewRequestId = useRef(0);

    useEffect(() => {
        if (!debouncedBody) {
            setPreviewHtml(null);
            setPreviewFailed(false);
            return;
        }

        const requestId = ++previewRequestId.current;
        setIsPreviewLoading(true);

        renderPreview({ body: debouncedBody }).then(result => {
            if (requestId !== previewRequestId.current) return;

            setIsPreviewLoading(false);

            if (result && typeof result === "object" && "html" in result) {
                setPreviewHtml((result as { html: string }).html);
                setPreviewFailed(false);
            } else {
                setPreviewFailed(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedBody]);

    if (isEditing && isLoadingTemplate) {
        return <Loading />;
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                    }}>
                    <Box sx={{ p: 0, flex: "1 1 480px", minWidth: 0 }}>
                        <Paper sx={{ mb: 1 }}>
                            <Box
                                display="flex"
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                }}>
                                <Box sx={{ p: 0, flex: 1, minWidth: 0 }}>
                                    <Typography variant="h3">
                                        {isEditing
                                            ? t("editEmailTemplateTitle")
                                            : t("createEmailTemplateTitle")}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 0, flexShrink: 0 }}>
                                    <InputWrapper
                                        control={control}
                                        {...emailTemplateEnabledField}
                                        label={t("enabled")}
                                        formControlSx={{ mb: 0 }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                        <Paper sx={{ mb: 1 }}>
                            <Box padding={0}>
                                {emailTemplateFormFields(isEditing).map(
                                    field => (
                                        <InputWrapper
                                            key={field.name}
                                            control={control}
                                            {...field}
                                        />
                                    )
                                )}
                            </Box>
                        </Paper>
                        <Paper>
                            <Box
                                padding={0}
                                display="flex"
                                justifyContent="space-between">
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    onClick={onCancel}
                                    disabled={isSaving}>
                                    {t("cancel")}
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isEditing
                                        ? t("saveChanges")
                                        : t("createEmailTemplate")}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>

                    <Box
                        sx={{
                            p: 0,
                            flex: "1 1 420px",
                            minWidth: 0,
                            position: "sticky",
                            top: 16,
                        }}>
                        <Paper sx={{ p: 0, overflow: "hidden" }}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                    {t("emailPreviewTitle")}
                                </Typography>
                                {isPreviewLoading && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {t("emailPreviewRendering")}
                                    </Typography>
                                )}
                            </Box>
                            {previewFailed && (
                                <Box sx={{ px: 2, pb: 2 }}>
                                    <Typography variant="body2" color="error">
                                        {t("emailPreviewError")}
                                    </Typography>
                                </Box>
                            )}
                            {!previewHtml && !isPreviewLoading && (
                                <Box sx={{ p: 2 }}>
                                    <Skeleton
                                        variant="rounded"
                                        height={480}
                                    />
                                </Box>
                            )}
                            {previewHtml && (
                                <iframe
                                    title={t("emailPreviewTitle")}
                                    srcDoc={previewHtml}
                                    sandbox=""
                                    style={{
                                        width: "100%",
                                        height: "70vh",
                                        border: "none",
                                        display: "block",
                                    }}
                                />
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Form>
        </FormProvider>
    );
}
