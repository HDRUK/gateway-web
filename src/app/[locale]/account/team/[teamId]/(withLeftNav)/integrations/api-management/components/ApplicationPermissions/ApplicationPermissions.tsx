"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Application, ApplicationForm } from "@/interfaces/Application";
import { Permission } from "@/interfaces/Permission";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormError from "@/components/FormError";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import ChangesActionBar from "@/modules/ChangesActionBar";
import useActionBar from "@/hooks/useActionBar";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    AppPermissionDefaultValues,
    appPermissionsDefaultValues,
    appPermissionsValidationSchema,
} from "@/config/forms/applicationPermissions";
import { getColumns } from "@/config/tables/apiPermissions";
import { RouteName } from "@/consts/routeName";
import {
    getChangeCount,
    getEnabledPermissions,
    getPayloadPermissions,
} from "./ApplicationPermissions.utils";

interface ApplicationPermissionsProps {
    isTabView?: boolean;
    application?: Application;
}

type ReadKey = "datasets.read" | "dur.read" | "tools.read" | "collections.read";

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement.manage.permissions`;

const ApplicationPermissions = ({
    isTabView = false,
    application,
}: ApplicationPermissionsProps) => {
    const [originalFormValues, setOriginalFormValues] = useState<
        AppPermissionDefaultValues | undefined
    >(undefined);

    const { push } = useRouter();
    const params = useParams<{
        teamId: string;
        apiId: string;
    }>();
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();

    const { data: permissions } = useGet<Permission[]>(apis.permissionsV1Url);

    const { mutate } = useSWRConfig();

    /* Pass default values and validation to react-hook-form */
    const { control, handleSubmit, reset, formState, setValue, watch } =
        useForm({
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
            localeKey: !isTabView ? "applicationPermission" : "",
        }
    );

    const collectionsFields = watch([
        "collections.create",
        "collections.delete",
        "collections.update",
    ]);

    const toolsFields = watch(["tools.create", "tools.delete", "tools.update"]);

    const datasetsFields = watch([
        "datasets.create",
        "datasets.delete",
        "datasets.update",
    ]);

    const durFields = watch(["dur.create", "dur.delete", "dur.update"]);

    const fieldGroups = {
        collections: collectionsFields,
        tools: toolsFields,
        datasets: datasetsFields,
        dur: durFields,
    };

    // Auto set read permission to true if create, update or delete checked
    useEffect(() => {
        Object.entries(fieldGroups)
            .filter(([_, fields]) => fields.some(Boolean))
            .forEach(([key]) => {
                const readKey = `${key}.read` as ReadKey;
                setValue(readKey, true);
            });
    }, [
        collectionsFields,
        toolsFields,
        datasetsFields,
        durFields,
        formState.dirtyFields,
    ]);

    const columnReadDisabled = useMemo(() => {
        return {
            collections: collectionsFields.some(v => v === true),
            tools: toolsFields.some(v => v === true),
            datasets: datasetsFields.some(v => v === true),
            dur: durFields.some(v => v === true),
        };
    }, [collectionsFields, toolsFields, datasetsFields, durFields]);

    /* Memoise columns using 'getColumns' from form config  */
    const columns = useMemo(() => {
        return getColumns<AppPermissionDefaultValues>(
            control,
            columnReadDisabled
        );
    }, [control, columnReadDisabled]);

    const onSubmit = useCallback(
        async (updatedPermissions: AppPermissionDefaultValues) => {
            const permissionIds = getPayloadPermissions(
                updatedPermissions,
                permissions!
            );
            const payload = {
                ...application,
                notifications: application?.notifications?.map(n => n.user_id),
                permissions: permissionIds,
                enabled: !isTabView ? true : application?.enabled,
            };

            await updateApplication(`${application?.id}`, payload);

            /* When this component is part of tabs view reset the 'application' cache */
            if (isTabView) {
                mutate(`${apis.applicationsV1Url}/${application?.id}`);

                notificationService.apiWarning(t("warning"), {
                    autoHideDuration: 5000,
                    persist: false,
                    title: "",
                });
            }

            /* Only redirect when this component is part of the "Create" journey */
            if (!isTabView) {
                /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
                setTimeout(() => {
                    push(
                        `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}`
                    );
                }, 500);
            }
        },
        [
            application,
            isTabView,
            mutate,
            permissions,
            push,
            params?.teamId,
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
            !isTabView
                ? handleSubmit(onSubmit)()
                : showBar("PermissionChanges", {
                      component: ChangesActionBar,
                      cancelText: t("discard"),
                      confirmText: t("save"),
                      changeCount: 1,
                      onSuccess: () =>
                          showModal({
                              title: t("modalTitle"),
                              content: t("modalContent"),
                              confirmText: t("save"),
                              cancelText: t("cancel"),
                              onSuccess: handleSubmit(onSubmit),
                          }),
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
        showModal,
    ]);

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ p: 2, mb: 1 }}>
                <Typography variant="h2">{t("title")}</Typography>
                <Typography>{t("intro")}</Typography>
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
            <Typography sx={{ fontWeight: "bold" }}>{t("helper")}</Typography>
            {!isTabView && (
                <Paper>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}>
                        <Link
                            href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}/${params?.apiId}`}
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
