"use client";

import Box from "@/components/Box";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";
import ProfileForm from "./components/ProfileForm";
import useAuth from "@/hooks/useAuth";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Loading from "@/components/Loading";

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
                        {isLoading ? <Loading /> : <ProfileForm />}
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

export default ProfilePage;
