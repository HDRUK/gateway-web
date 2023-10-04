import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
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
import usePatch from "@/hooks/usePatch";
import Link from "next/link";
import {
    AppPermissionDefaultValues,
    appPermissionsDefaultValues,
} from "@/config/forms/applicationPermissions";
import {
    getEnabledPermissions,
    getPayloadPermissions,
} from "./permissions.utils";

const AddPermissionsPage = () => {
    const { query } = useRouter();
    const { apiId, teamId } = query;
    const { data: application } = useGet<Application>(
        `${apis.applicationsV1Url}/${apiId}`
    );
    const { data: permissions } = useGet<Permission[]>(apis.permissionsV1Url);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: appPermissionsDefaultValues,
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

    const updateApplication = usePatch<Partial<ApplicationPayload>>(
        `${apis.applicationsV1Url}`,
        {
            itemName: "Application",
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

        updateApplication(`${application?.id}`, {
            permissions: permissionIds,
            enabled: true,
        });
    };

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Creation" />
                <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(onSubmit)}>
                    <Paper sx={{ marginBottom: 1 }}>
                        <Box>
                            <Typography variant="h2">Permissions</Typography>
                            <Typography>
                                Use this form to assign the right level of scope
                                and permission for the application to manage
                                integration and connect securely to the Gateway.
                                Your application will only be able to
                                synchronize data within its assigned scope and
                                permission. Application permissions is the
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
                <ActionBar />
            </AccountLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default AddPermissionsPage;
