"use client";

import Box from "@/components/Box";
import Button from "@/components/Button";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";
import useAuth from "@/hooks/useAuth";
import { AddIcon } from "@/consts/icons";
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
                        <Box
                            display="flex"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "start",
                            }}>
                            <div>
                                <Typography variant="h2">Teams</Typography>
                                <Typography sx={{ marginBottom: 4 }}>
                                    Onboard and manage data provider teams on
                                    the Gateway
                                </Typography>
                            </div>
                            {permissions["custodians.create"] && (
                                <Button startIcon={<AddIcon />}>
                                    Add a new team
                                </Button>
                            )}
                        </Box>
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
