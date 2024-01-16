"use client";

import Box from "@/components/Box";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";
import useAuth from "@/hooks/useAuth";
import TeamsList from "./components/TeamsList";

export default function Teams({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) {
    const { isLoading } = useAuth();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Teams" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Teams</Typography>
                        <Typography sx={{ marginBottom: 4 }}>
                            Use this form to register an account and update your
                            account on the Gateway
                        </Typography>
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <TeamsList permissions={permissions} />
                        )}
                    </Box>
                </Paper>
            </AccountLayout>
        </>
    );
}
