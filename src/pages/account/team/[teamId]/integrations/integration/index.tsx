import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import AccountLayout from "@/components/AccountLayout";
import { useRouter } from "next/router";

const TeamIntegrationsPage = () => {
    const router = useRouter();
    return (
        <>
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
                            img="/images/account/teams/integrations/integration-create.jpg"
                            href={`/account/team/${router.query.teamId}/integrations/integration/create`}
                            buttonText="Create new Integration"
                        />
                        <ImageMediaCard
                            img="/images/account/teams/integrations/integration-manage.jpg"
                            href={`/account/team/${router.query.teamId}/integrations/integration/list`}
                            buttonText="Manage Integrations"
                        />
                    </Box>
                </Box>
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

export default TeamIntegrationsPage;
