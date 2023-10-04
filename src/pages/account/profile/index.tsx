import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ProfileForm from "@/modules/ProfileForm";
import useAuth from "@/hooks/useAuth";
import { CircularProgress } from "@mui/material";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";

const ProfilePage = () => {
    const { isLoading } = useAuth();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Profile" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Your profile</Typography>
                        <Typography sx={{ marginBottom: 4 }}>
                            Use this form to register an account and update your
                            account on the Gateway
                        </Typography>
                        {isLoading ? (
                            <CircularProgress color="secondary" />
                        ) : (
                            <ProfileForm />
                        )}
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

export default ProfilePage;
