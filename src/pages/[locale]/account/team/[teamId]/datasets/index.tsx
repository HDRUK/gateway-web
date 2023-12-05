import ProtectedRoute from "@/components/ProtectedRoute";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { GetServerSideProps } from "next";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";
import TeamDatasets from "@/modules/TeamDatasets";
import Paper from "@/components/Paper";
import messages from "@/config/messages/en.json";

const TeamDatasetsPage = () => {
    return (
        <ProtectedRoute permissions={["fe.account.nav.datasets"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Datasets" />
            <AccountLayout>
                <BoxContainer sx={{ gap: 0 }}>
                    <Paper>
                        <Box sx={{ bgcolor: "white", mb: 0 }}>
                            <Typography variant="h2">Datasets</Typography>
                            <Typography>
                                View, add, edit, archive and check the status of
                                your datasets.
                            </Typography>
                        </Box>
                    </Paper>
                    <TeamDatasets />
                </BoxContainer>
            </AccountLayout>
        </ProtectedRoute>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default TeamDatasetsPage;
