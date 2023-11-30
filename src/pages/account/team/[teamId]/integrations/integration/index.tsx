"use client";

import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import AccountLayout from "@/modules/AccountLayout";
import { useSearchParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";

const TeamIntegrationsPage = () => {
    const searchParams = useSearchParams();
    const teamId = searchParams.get("teamId") as string;
    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.integration"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integrations Management" />
            <AccountLayout>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 3", laptop: "span 4" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Box sx={{ display: "flex", gap: "40px" }}>
                        <ImageMediaCard
                            img="/images/account/teams/integrations/create.jpg"
                            href={`/account/team/${teamId}/integrations/integration/create`}
                            buttonText="Create new Integration"
                        />
                        <ImageMediaCard
                            img="/images/account/teams/integrations/manage.jpg"
                            href={`/account/team/${teamId}/integrations/integration/list`}
                            buttonText="Manage Integrations"
                        />
                    </Box>
                </Box>
            </AccountLayout>
        </ProtectedRoute>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default TeamIntegrationsPage;
