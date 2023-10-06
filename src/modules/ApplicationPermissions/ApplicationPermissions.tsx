import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Table from "@/components/Table";
import { useEffect, useMemo } from "react";
import { Permission } from "@/interfaces/Permission";
import { getColumns } from "@/config/tables/apiPermissions";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { Application, ApplicationPayload } from "@/interfaces/Application";
import { useRouter } from "next/router";

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
import {
    getEnabledPermissions,
    getPayloadPermissions,
} from "./ApplicationPermissions.utils";

const ApplicationPermissions = () => {
    const { query, push } = useRouter();
    const { apiId, teamId } = query;
    const { data: application } = useGet<Application>(
        `${apis.applicationsV1Url}/${apiId}`
    );

    const { data: permissions } = useGet<Permission[]>(apis.permissionsV1Url);

    const { control, handleSubmit, reset, formState } = useForm({
        defaultValues: appPermissionsDefaultValues,
        resolver: yupResolver(appPermissionsValidationSchema),
    });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
        modalProps: {
            content:
                "Changes to your API information are not automatically saved.",
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

        reset(existingPermissions);
    }, [application, reset]);

    const updateApplication = usePut<Partial<ApplicationPayload>>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
            localeKey: "applicationPermission",
        }
    );

    const columns = useMemo(() => {
        return getColumns<AppPermissionDefaultValues>(control);
    }, [control]);

    const onSubmit = async (updatedPermissions: AppPermissionDefaultValues) => {
        const permissionIds = getPayloadPermissions(
            updatedPermissions,
            permissions!
        );

        await updateApplication(`${application?.id}`, {
            ...application,
            permissions: permissionIds,
            enabled: true,
        });
        setTimeout(() => {
            push(
                `/account/team/${query.teamId}/integrations/api-management/list`
            );
        }, 500);
    };

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">Permissions</Typography>
                    <Typography>
                        Use this form to assign the right level of scope and
                        permission for the application to manage integration and
                        connect securely to the Gateway. Your application will
                        only be able to synchronize data within its assigned
                        scope and permission. Application permissions is the
                        responsibility of your publisher team
                    </Typography>
                </Box>
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
        </Form>
    );
};

export default ApplicationPermissions;
