import ProtectedRoute from "@/components/ProtectedRoute";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";

const TeamDatasetsPage = () => {
    const tabsList = [
        {
            label: "Active (0)",
            value: "active",
            content: <Box />,
        },
        {
            label: "Draft (0)",
            value: "draft",
            content: <Box />,
        },
        {
            label: "Archived (0)",
            value: "archived",
            content: <Box />,
        },
    ];
    return (
        <ProtectedRoute permissions={["fe.account.nav.datasets"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Datasets" />
            <AccountLayout>
                <BoxContainer>
                    <Box sx={{ bgcolor: "white" }}>
                        <Typography variant="h2">Datasets</Typography>
                        <Typography>
                            View, add, edit, archive and check the status of
                            your datasets.
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        />
                        <Tabs
                            centered
                            tabs={tabsList}
                            tabBoxSx={{ padding: 0 }}
                            rootBoxSx={{ padding: 0 }}
                        />
                    </Box>
                </BoxContainer>
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

export default TeamDatasetsPage;
