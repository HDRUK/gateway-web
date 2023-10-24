import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    integrationDefaultValues,
    integrationEditFormFields,
    integrationValidationSchema,
} from "@/config/forms/integration";
import InputWrapper from "@/components/InputWrapper";
import apis from "@/config/apis";
import { useRouter } from "next/router";
import Paper from "@/components/Paper";
import { useEffect, useMemo } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import useGet from "@/hooks/useGet";
import { Team } from "@/interfaces/Team";
import { Integration, IntegrationPayload } from "@/interfaces/Integration";
import { requiresSecretKey } from "@/utils/integrations";
import usePut from "@/hooks/usePut";
import RunFederationTest from "@/components/RunFederationTest";
import Switch from "@/components/Switch";
import Tooltip from "@/components/Tooltip";

const EditIntegrationForm = () => {
    const { query } = useRouter();
    const { data: integration, isLoading: isLoadingIntegration } =
        useGet<Integration>(
            `${apis.teamsV1Url}/${query.teamId}/federations/${query.intId}`,
            { shouldFetch: !!query.teamId || !!query.intId }
        );

    const { data: team } = useGet<Team>(`${apis.teamsV1Url}/${query.teamId}`, {
        shouldFetch: !!query.teamId,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState,
        watch,
        unregister,
        setValue,
        getValues,
    } = useForm<IntegrationPayload>({
        mode: "onTouched",
        resolver: yupResolver(integrationValidationSchema),
        defaultValues: integrationDefaultValues,
    });

    useEffect(() => {
        reset({
            ...integration,
            notifications: integration?.notifications?.map(
                (notification: { email: string }) => notification.email
            ),
        });
    }, [integration, reset]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const updateIntegration = usePut<Integration>(
        `${apis.teamsV1Url}/${query.teamId}/federations`,
        {
            shouldFetch: !!query.teamId,
            itemName: "Integration",
        }
    );

    const submitForm = async (payload: Integration) => {
        //note:
        // - do we need to update the value of integration with what is returned by this update?
        // - integration is sent to RunFederationTest and will remain unchanged from the original get...
        await updateIntegration(payload.id, payload);
        //integration = await updateIntegration(payload.id, payload);
    };

    const handleRun = (testStatus: boolean) => {
        setValue("tested", testStatus);
        if (testStatus === false) {
            //if the test has failed or been reset, auto-disable the integration
            setValue("enabled", false);
        }
    };

    const tested = watch("tested");
    const auth_type = watch("auth_type");

    //note: this should have worked... but it doesn't.. gets stuck in a loop
    //const fieldsToWatch = watch([..]);
    // - watch('auth_secret_key') :: works
    // - watch(['auth_secret_key']) :: does not work
    // - despite what is said on: https://www.react-hook-form.com/api/useform/watch/

    //instead use useWatch
    // - limit watching to just the fields that are in the EditForm using name: [<field names>]
    // - otherwise it gets stuck in a loop because 'tested' and 'enabled' are updated automatically
    //This is also loading the form asynchronously..
    // - therefore we
    const fieldsToWatch = useWatch({
        control,
        name: integrationEditFormFields.map(f => f.name),
        //.filter(f => f != "run_time_hour"),
        defaultValue: undefined,
    });

    useEffect(() => {
        if (!requiresSecretKey(auth_type)) {
            unregister("auth_secret_key");
        }
    }, [auth_type, unregister]);

    const hydratedFormFields = useMemo(
        () =>
            integrationEditFormFields
                .map(field => {
                    if (field.name === "notifications") {
                        return {
                            ...field,
                            options: team?.users.map(teamUser => ({
                                value: teamUser.email,
                                label: `${teamUser.firstname} ${teamUser.lastname}`,
                            })),
                        };
                    }
                    if (
                        field.name === "auth_secret_key" &&
                        !requiresSecretKey(auth_type)
                    ) {
                        return null;
                    }
                    return field;
                })
                .filter(field => !!field),
        [team, auth_type]
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
                                key={field.name}
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
                    <Paper sx={{ p: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Tooltip
                                placement="bottom"
                                title={
                                    tested
                                        ? ""
                                        : "You must run a successful test before you can Enable the integration."
                                }>
                                <Switch
                                    disabled={!tested}
                                    control={control}
                                    name="enabled"
                                    formControlSx={{ mb: 0 }}
                                />
                            </Tooltip>
                        </Box>
                    </Paper>
                    <Box sx={{ p: 0, flex: 1 }}>
                        <RunFederationTest
                            watch={fieldsToWatch}
                            teamId={query.teamId}
                            formIsValid={formState.isValid}
                            isEnabled={getValues("enabled")}
                            integration={{
                                //this is bugged if the form is changed and integration is not saved
                                //if the user changes the form, doesnt click save, and runs the test
                                //the test will still use the original data from GET
                                //it wont use the form data..
                                auth_type: integration?.auth_type,
                                auth_secret_key: integration?.auth_secret_key,
                                endpoint_baseurl: integration?.endpoint_baseurl,
                                endpoint_datasets:
                                    integration?.endpoint_datasets,
                                endpoint_dataset: integration?.endpoint_dataset,
                                run_time_hour: integration?.run_time_hour,
                                enabled: integration?.enabled,
                            }}
                            onRun={handleRun}
                        />
                    </Box>
                </Box>
            </Box>
            <Paper>
                <Box
                    padding={0}
                    display="flex"
                    justifyContent="end"
                    marginBottom={10}>
                    <Button type="submit">Save configuration</Button>
                </Box>
            </Paper>
        </Form>
    );
};

export default EditIntegrationForm;
