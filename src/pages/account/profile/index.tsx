import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ProfileForm from "@/modules/profile/ProfileForm";
import useAuth from "@/hooks/useAuth";
import { CircularProgress, Typography } from "@mui/material";
import Paper from "@/components/Paper";
import AccountLayout from "@/components/AccountLayout";

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
                            Your details are used when you make a data access
                            request application.
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
