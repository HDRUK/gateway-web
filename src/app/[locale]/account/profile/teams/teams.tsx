"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { PlusIcon } from "@/consts/icons";
import { Routes } from "@/consts/routes";
import TeamsList from "./components/TeamsList";

export default function Teams({
    permissions,
}: {
    permissions: { [key: string]: boolean };
}) {
    const { isLoading } = useAuth();
    const t = useTranslations("pages.account.profile.teams");

    return (
        <Paper>
            <Box>
                <Box
                    display="flex"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "start",
                    }}>
                    <div>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography sx={{ marginBottom: 4 }}>
                            {t("text")}
                        </Typography>
                    </div>
                    {permissions["custodians.create"] && (
                        <Link passHref href={Routes.ACCOUNT_CREATE_TEAM}>
                            <Button startIcon={<PlusIcon />}>
                                {t("addTeamButton")}
                            </Button>
                        </Link>
                    )}
                </Box>
                {isLoading ? (
                    <Loading />
                ) : (
                    <TeamsList permissions={permissions} />
                )}
            </Box>
        </Paper>
    );
}
