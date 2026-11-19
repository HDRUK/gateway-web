"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, Resolver, useForm, useWatch } from "react-hook-form";
import { validateDefinition } from "@hdruk/experiments";
import {
    BuilderLocaleText,
    ExperimentBuilder,
} from "@hdruk/experiments/builder";
import { Button, Loading } from "@hdruk/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { AdminExperiment, ExperimentFormValues } from "@/interfaces/Experiment";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import {
    experimentDefaultValues,
    experimentSettingsFields,
    experimentTargetingFields,
    experimentToFormValues,
    experimentToPayload,
    experimentValidationSchema,
} from "@/config/forms/experiment";
import { getAvailableUsers } from "@/utils/user";
import ExperimentRichTextEditor from "./ExperimentRichTextEditor";
import useExperimentImageUpload from "./useExperimentImageUpload";

interface ExperimentFormProps {
    experimentId?: number;
    onDone: () => void;
    onCancel: () => void;
}

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";
const BUILDER_SLOTS = { richTextEditor: ExperimentRichTextEditor };

export default function ExperimentForm({
    experimentId,
    onDone,
    onCancel,
}: ExperimentFormProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const tBuilder = useTranslations("modules.experimentBuilder");
    const isEditing = !!experimentId;
    const uploadImage = useExperimentImageUpload();
    const [isSaving, setIsSaving] = useState(false);
    const [showDefinitionErrors, setShowDefinitionErrors] = useState(false);

    const { data: existing, isLoading } = useGet<AdminExperiment>(
        isEditing ? `${apis.experimentsV1Url}/${experimentId}` : null
    );

    const methods = useForm<ExperimentFormValues>({
        mode: "onTouched",
        resolver: yupResolver(
            experimentValidationSchema
        ) as unknown as Resolver<ExperimentFormValues>,
        defaultValues: experimentDefaultValues,
    });

    const { control, handleSubmit, reset, setValue } = methods;
    const definition = useWatch({ control, name: "definition" });
    const audience = useWatch({ control, name: "audience" });
    const triggerOn = useWatch({ control, name: "trigger_on" });

    const { data: users, isLoading: isLoadingUsers } = useGet<User[]>(
        `${apis.usersV1Url}?mini`,
        { shouldFetch: audience === "user_ids" }
    );
    const userOptions = useMemo(
        () => (Array.isArray(users) ? getAvailableUsers([], users) : []),
        [users]
    );

    useEffect(() => {
        if (!existing) {
            return;
        }
        reset(experimentToFormValues(existing));
    }, [existing, reset]);

    const createExperiment = usePost(apis.experimentsV1Url, {
        itemName: "Experiment",
    });
    const editExperiment = usePut(apis.experimentsV1Url, {
        itemName: "Experiment",
    });

    const definitionErrors = validateDefinition(definition);

    const submitForm = async (values: ExperimentFormValues) => {
        if (isSaving) {
            return;
        }
        if (definitionErrors.length) {
            setShowDefinitionErrors(true);
            return;
        }

        setIsSaving(true);
        const payload = experimentToPayload(values);
        const result = isEditing
            ? await editExperiment(experimentId as number, payload)
            : await createExperiment(payload);
        setIsSaving(false);

        if (result) {
            onDone();
        }
    };

    if (isEditing && isLoading) {
        return <Loading />;
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Paper sx={{ mb: 1 }}>
                    <Box>
                        <Typography variant="h3">
                            {isEditing
                                ? t("editExperimentTitle")
                                : t("createExperimentTitle")}
                        </Typography>
                    </Box>
                </Paper>
                <Box
                    sx={{
                        p: 0,
                        mb: 1,
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}>
                    <Paper>
                        <Box>
                            <Typography variant="h6" component="h4">
                                {t("experimentSettings")}
                            </Typography>
                            {experimentSettingsFields.map(field => (
                                <InputWrapper
                                    key={field.name}
                                    control={control}
                                    {...field}
                                />
                            ))}
                        </Box>
                    </Paper>
                    <Paper>
                        <Box>
                            <Typography variant="h6" component="h4">
                                {t("experimentTargeting")}
                            </Typography>
                            {experimentTargetingFields(
                                audience,
                                triggerOn,
                                userOptions
                            ).map(field => (
                                <InputWrapper
                                    key={field.name}
                                    control={control}
                                    isLoadingOptions={
                                        field.name === "user_ids" &&
                                        isLoadingUsers
                                    }
                                    {...field}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Box>
                <Paper sx={{ mb: 1 }}>
                    <Box>
                        <Typography variant="h6" component="h4">
                            {t("experimentContent")}
                        </Typography>
                        {showDefinitionErrors &&
                            definitionErrors.length > 0 && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {t("experimentContentErrors", {
                                        count: definitionErrors.length,
                                    })}
                                </Alert>
                            )}
                        <ExperimentBuilder
                            value={definition}
                            onChange={value =>
                                setValue("definition", value, {
                                    shouldDirty: true,
                                })
                            }
                            localeText={
                                tBuilder.raw(
                                    "builder"
                                ) as Partial<BuilderLocaleText>
                            }
                            previewLocaleText={tBuilder.raw("prompt")}
                            uploadImage={uploadImage}
                            slots={BUILDER_SLOTS}
                        />
                    </Box>
                </Paper>
                <Paper>
                    <Box
                        padding={0}
                        display="flex"
                        justifyContent="space-between">
                        <Button
                            purpose="secondary"
                            onClick={onCancel}
                            disabled={isSaving}>
                            {t("cancel")}
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isEditing
                                ? t("saveChanges")
                                : t("createExperiment")}
                        </Button>
                    </Box>
                </Paper>
            </Form>
        </FormProvider>
    );
}
