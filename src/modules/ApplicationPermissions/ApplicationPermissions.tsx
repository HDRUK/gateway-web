"use client";

import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Table from "@/components/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Permission } from "@/interfaces/Permission";
import { getColumns } from "@/config/tables/apiPermissions";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { Application, ApplicationForm } from "@/interfaces/Application";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@/components/Form";
import { useForm } from "react-hook-form";

import Button from "@/components/Button";
import Link from "next/link";
import {
    AppPermissionDefaultValues,
    appPermissionsDefaultValues,
    appPermissionsValidationSchema,
} from "@/config/forms/applicationPermissions";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import FormError from "@/components/FormError";
import { yupResolver } from "@hookform/resolvers/yup";
import useActionBar from "@/hooks/useActionBar";
import ChangesActionBar from "@/modules/ChangesActionBar";
import { useSWRConfig } from "swr";
import {
    getChangeCount,
    getEnabledPermissions,
    getPayloadPermissions,
} from "./ApplicationPermissions.utils";

interface ApplicationPermissionsProps {
    isTabView?: boolean;
    application?: Application;
}

const ApplicationPermissions = ({
    isTabView = false,
    application,
}: ApplicationPermissionsProps) => {
    const [originalFormValues, setOriginalFormValues] = useState<
        AppPermissionDefaultValues | undefined
    >(undefined);

    const searchParams = useSearchParams();
    const teamId = searchParams.get("teamId") as string;
    const apiId = searchParams.get("apiId") as string;
    const router = useRouter();

    const { data: permissions } = useGet<Permission[]>(apis.permissionsV1Url);

    const { mutate } = useSWRConfig();

    /* Pass default values and validation to react-hook-form */
    const { control, handleSubmit, reset, formState } = useForm({
        defaultValues: appPermissionsDefaultValues,
        resolver: yupResolver(appPermissionsValidationSchema),
    });

    /* Launch ActionBar if there are form changes  */
    const { showBar, hideBar, store, updateStoreProps } = useActionBar();

    /* Launch pop-up if unsaved changes on leaving the page */
    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
        modalProps: {
            content: "Changes to permissions are not automatically saved.",
        },
    });

    const tableRows = [
        { name: "datasets", label: "Datasets" },
        { name: "dur", label: "Data Use Register" },
        { name: "tools", label: "Tools" },
        { name: "collections", label: "Collections" },
    ];

    useEffect(() => {
        if (!application) return;

        const existingPermissions = getEnabledPermissions(
            application.permissions,
            appPermissionsDefaultValues
        );

        /* Store `originalFormValues` to allow resetting of form data when clicking 'discard' */
        setOriginalFormValues(existingPermissions);

        /* Initiate react-hook-form with initial form values using 'reset' fn */
        reset(existingPermissions);
    }, [application, reset]);

    const updateApplication = usePut<Partial<ApplicationForm>>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
            /* Custom api success message set within `api.json` */
            localeKey: "applicationPermission",
        }
    );

    /* Memoise columns using 'getColumns' from form config  */
    const columns = useMemo(() => {
        return getColumns<AppPermissionDefaultValues>(control);
    }, [control]);

    const onSubmit = useCallback(
        async (updatedPermissions: AppPermissionDefaultValues) => {
            const permissionIds = getPayloadPermissions(
                updatedPermissions,
                permissions!
            );
            const payload = {
                ...application,
                notifications: application?.notifications?.map(n => n.email),
                permissions: permissionIds,
                enabled: true,
            };

            await updateApplication(`${application?.id}`, payload);

            /* When this component is part of tabs view reset the 'application' cache */
            if (isTabView) {
                mutate(`${apis.applicationsV1Url}/${application?.id}`);
            }

            /* Only redirect when this component is part of the "Create" journey */
            if (!isTabView) {
                /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
                setTimeout(() => {
                    router.push(
                        `/account/team/${teamId}/integrations/api-management/list`
                    );
                }, 500);
            }
        },
        [
            application,
            isTabView,
            mutate,
            permissions,
            router,
            teamId,
            updateApplication,
        ]
    );

    /* Increment custom `changeCount` prop within 'ActionBarProvider' using 'updateStoreProps' */
    useEffect(() => {
        updateStoreProps({
            changeCount: getChangeCount(formState.dirtyFields),
        });
    }, [formState, updateStoreProps]);

    useEffect(() => {
        /* ActionBar only required on tab view */
        if (!isTabView) return;

        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("PermissionChanges", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onSuccess: () => {
                    handleSubmit(onSubmit)();
                },
                onCancel: () => {
                    reset(originalFormValues);
                },
            });
        }
        if (!formState.isDirty && store.isVisible) {
            hideBar();
        }
    }, [
        application,
        formState,
        handleSubmit,
        hideBar,
        isTabView,
        onSubmit,
        originalFormValues,
        reset,
        showBar,
        store.isVisible,
    ]);

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ p: 2, mb: 1 }}>
                <Typography variant="h2">Permissions</Typography>
                <Typography>
                    Use this form to assign the right level of scope and
                    permission for the application to manage integration and
                    connect securely to the Gateway. Your application will only
                    be able to synchronize data within its assigned scope and
                    permission. Application permissions is the responsibility of
                    your publisher team
                </Typography>
            </Paper>
            <Paper sx={{ mb: 1 }}>
                <Table<{
                    name: string;
                    label: string;
                }>
                    columns={columns}
                    rows={tableRows}
                />
                {!formState.isValid && formState.isSubmitted && (
                    <Box>
                        <FormError
                            error={{
                                type: "custom",
                                message:
                                    "You must assign a scope and permission before saving",
                            }}
                        />
                    </Box>
                )}
            </Paper>
            {!isTabView && (
                <Paper>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Link
                            href={`/account/team/${teamId}/integrations/api-management/create/${apiId}`}
                            passHref>
                            <Button color="secondary" variant="outlined">
                                Back
                            </Button>
                        </Link>
                        <Button type="submit">Save &amp; Continue</Button>
                    </Box>
                </Paper>
            )}
        </Form>
    );
};

export default ApplicationPermissions;
