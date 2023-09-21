import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";

const TeamDatasetsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Datasets" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Datasets</Typography>
                    </Box>
                </Paper>
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

export default TeamDatasetsPage;
