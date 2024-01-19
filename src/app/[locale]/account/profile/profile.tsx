"use client";

import Box from "@/components/Box";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import ProfileForm from "./components/ProfileForm";

const ProfilePage = () => {
    const { isLoading } = useAuth();

    return (
        <Paper>
            <Box>
                <Typography variant="h2">Your profile</Typography>
                <Typography sx={{ marginBottom: 4 }}>
                    Use this form to register an account and update your account
                    on the Gateway
                </Typography>
                {isLoading ? <Loading /> : <ProfileForm />}
            </Box>
        </Paper>
    );
};

export default ProfilePage;
