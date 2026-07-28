"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Stack, Typography } from "@mui/material";
import { pick } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Federation, FederationRunStatus } from "@/interfaces/Federation";
import {
    Integration,
    IntegrationForm,
    IntegrationPayload,
} from "@/interfaces/Integration";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import RunFederationTest from "@/components/RunFederationTest";
import SwitchInline from "@/components/SwitchInline";
import { AutorenewIcon, CheckIcon } from "@/consts/icons";
import useGet from "@/hooks/useGet";
import useGetTeam from "@/hooks/useGetTeam";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import useTestFederation, {
    watchFederationKeys,
} from "@/hooks/useTestFederation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    integrationDefaultValues,
    integrationEditFormFields,
    integrationFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import { RouteName } from "@/consts/routeName";
import apiService from "@/services/api";
import { requiresSecretKey } from "@/utils/integrations";

const EditIntegrationForm = () => {
    const { push } = useRouter();
    const t = useTranslations("api");
    const params = useParams<{
        teamId: string;
        intId: string;
    }>();

    const roundToQuarter = (minute: string) => {
        const rounded = Math.round(parseInt(minute, 10) / 15) * 15 % 60;
        return rounded.toString().padStart(2, "0");
    };
    const { data: integration } = useGet<Integration>(
        `${apis.teamsV1Url}/${params?.teamId}/federations/${params?.intId}`,
        { shouldFetch: !!params?.teamId && !!params?.intId }
    );

    const { team } = useGetTeam(params?.teamId as string);

    const isEditing = params?.intId;

    const {
        control,
        handleSubmit,
        reset,
        formState,
        watch,
        setValue,
        getValues,
        unregister,
    } = useForm<IntegrationForm>({
        mode: "onTouched",
        resolver: yupResolver(integrationValidationSchema),
        defaultValues: integrationDefaultValues,
    });

    const { testStatus, setTestedConfig, testResponse, handleTest } =
        useTestFederation({
            teamId: params?.teamId || "",
            integration: integration || {
                ...integrationDefaultValues,
                ...getValues(),
                run_time_hour: parseInt(getValues("run_time_hour"), 10),
                notifications: [],
            },
            tested: getValues("tested"),
            control,
            reset,
            getValues,
            setValue,
        });

    useEffect(() => {
        if (!integration) return;

        /* Populate form with saved integration */
        const formData: IntegrationForm = {
            ...integration,
            run_time_hour: integration.run_time_hour
                .toString()
                .padStart(2, "0"),
            run_time_minute: roundToQuarter(integration.run_time_minute),
            notifications: integration?.notifications?.map(
                (notification: { user_id: number }) => notification.user_id
            ),
        };

        const federationFields = pick(
            formData,
            watchFederationKeys
        ) as unknown as Federation;

        setTestedConfig(federationFields);
        reset(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integration, reset]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const createIntegration = usePost<IntegrationPayload>(
        `${apis.teamsV1Url}/${params?.teamId}/federations`,
        {
            shouldFetch: !!params?.teamId,
            itemName: "Integration",
        }
    );

    const updateIntegration = usePut<IntegrationPayload>(
        `${apis.teamsV1Url}/${params?.teamId}/federations`,
        {
            shouldFetch: !!params?.teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: IntegrationForm) => {
        const runTimeHour = parseInt(payload.run_time_hour, 10);

        if (!isEditing) {
            const createIntegrationResponse = await createIntegration({
                ...integrationDefaultValues,
                ...payload,
                run_time_hour: runTimeHour,
            });

            if (createIntegrationResponse) {
                setTimeout(() => {
                    push(
                        `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`
                    );
                });
            }
        } else {
            const updatedPayload = {
                ...payload,
                run_time_hour: runTimeHour,
            };
            await updateIntegration(payload.id, updatedPayload);
        }
    };

    const tested = watch("tested");
    const enabled = watch("enabled");
    const auth_type = watch("auth_type");

    const [runNowStatus, setRunNowStatus] = useState<FederationRunStatus>(
        FederationRunStatus.IDLE
    );
    const revertTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => clearTimeout(revertTimeoutRef.current);
    }, []);

    const MIN_RUNNING_DISPLAY_MS = 600;

    const handleRunNow = async () => {
        setRunNowStatus(FederationRunStatus.RUNNING);

        const minDisplay = new Promise(resolve =>
            setTimeout(resolve, MIN_RUNNING_DISPLAY_MS)
        );
        const [response] = await Promise.all([
            apiService.getRequest(
                `${apis.teamsV1Url}/${params?.teamId}/federations/${params?.intId}/run`,
                {
                    notificationOptions: {
                        itemName: "Integration",
                        t,
                    },
                }
            ),
            minDisplay,
        ]);

        setRunNowStatus(
            response !== null
                ? FederationRunStatus.COMPLETE
                : FederationRunStatus.IDLE
        );
        if (response !== null) {
            revertTimeoutRef.current = setTimeout(
                () => setRunNowStatus(FederationRunStatus.IDLE),
                3000
            );
        }
    };

    /* unregister 'auth_secret_key' if 'auth_type' is set to "NO_AUTH" */
    useEffect(() => {
        if (!requiresSecretKey(auth_type!)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const hydratedFormFields = useMemo(
        () =>
            (isEditing ? integrationEditFormFields : integrationFormFields)
                .map(field => {
                    /* populate 'notifications' with team members */
                    if (field.name === "notifications") {
                        return {
                            ...field,
                            options: team?.users?.map(teamUser => ({
                                value: teamUser.id,
                                label: `${teamUser.firstname} ${
                                    teamUser.lastname
                                } (${
                                    teamUser.preferred_email === "primary"
                                        ? teamUser.email
                                        : teamUser.secondary_email
                                })`,
                            })),
                        };
                    }
                    return field;
                })
                /* Remove 'auth_secret_key' field if 'auth_type' is set to "NO_AUTH"  */
                .filter(
                    field =>
                        field.name !== "auth_secret_key" ||
                        (field.name === "auth_secret_key" &&
                            requiresSecretKey(auth_type!))
                ),
        [team, auth_type, isEditing]
    );

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            <Box
                sx={{
                    p: 0,
                    gap: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                }}>
                <Paper sx={{ marginBottom: 1, gridColumn: "span 2" }}>
                    <Box padding={0}>
                        {hydratedFormFields.map(field => (
                            <InputWrapper
                                key={field.name.toString()}
                                horizontalForm
                                control={control}
                                {...field}
                            />
                        ))}
                    </Box>
                </Paper>
                <Box
                    sx={{
                        p: 0,
                        gap: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    {integration?.error && (
                        <Alert severity="error">{integration.error_text}</Alert>
                    )}
                    <Paper sx={{ p: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ display: "flex" }}>
                                <Typography>Disabled</Typography>
                                <SwitchInline
                                    disabled={!tested}
                                    control={control}
                                    name="enabled"
                                    formControlSx={{ mb: 0 }}
                                    title={
                                        tested
                                            ? ""
                                            : "You must run a successful test before you can Enable the integration."
                                    }
                                    aria-label="Integration status"
                                />
                                <Typography>Enabled</Typography>
                            </Stack>
                        </Box>
                    </Paper>
                    <Box sx={{ p: 0, flex: 1 }}>
                        <RunFederationTest
                            status={testStatus}
                            runResponse={testResponse}
                            isEnabled={formState.isValid}
                            onTest={handleTest}
                        />
                    </Box>
                </Box>
            </Box>
            <Paper>
                <Box
                    padding={0}
                    display="flex"
                    justifyContent="end"
                    gap={2}
                    marginBottom={10}>
                    <Button
                        type="button"
                        variant="outlined"
                        color="success"
                        disabled={
                            !isEditing ||
                            formState.isDirty ||
                            !tested ||
                            !enabled ||
                            runNowStatus === FederationRunStatus.RUNNING
                        }
                        startIcon={
                            runNowStatus === FederationRunStatus.RUNNING ? (
                                <AutorenewIcon />
                            ) : runNowStatus === FederationRunStatus.COMPLETE ? (
                                <CheckIcon />
                            ) : undefined
                        }
                        onClick={handleRunNow}>
                        {runNowStatus === FederationRunStatus.RUNNING
                            ? "Running"
                            : runNowStatus === FederationRunStatus.COMPLETE
                            ? "Complete"
                            : "Run now"}
                    </Button>
                    <Button type="submit">Save configuration</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default EditIntegrationForm;
