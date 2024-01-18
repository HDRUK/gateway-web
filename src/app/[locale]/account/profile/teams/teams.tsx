"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";
import useAuth from "@/hooks/useAuth";
import { AddIcon } from "@/consts/icons";
import { TEXT, TITLE } from "@/consts/translation";
import TeamsList from "./components/TeamsList";

export default function Teams({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) {
    const { isLoading } = useAuth();
    const t = useTranslations(`pages.account.profile.teams`);
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
                                <Typography variant="h2">{t(TITLE)}</Typography>
                                <Typography sx={{ marginBottom: 4 }}>
                                    {t(TEXT)}
                                </Typography>
                            </div>
                            {permissions["custodians.create"] && (
                                <Button startIcon={<AddIcon />}>
                                    {t("addTeamButton")}
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
