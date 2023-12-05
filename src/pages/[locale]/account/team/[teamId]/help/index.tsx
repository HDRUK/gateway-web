import Box from "@/components/Box";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";

const TeamHelpPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Help" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Help</Typography>
                    </Box>
                </Paper>
            </AccountLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default TeamHelpPage;
