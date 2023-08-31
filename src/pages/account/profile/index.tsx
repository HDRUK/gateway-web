import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ProfileForm from "@/modules/profile/ProfileForm";
import useAuth from "@/hooks/useAuth";
import { CircularProgress, Typography } from "@mui/material";
import LeftNav from "@/modules/LeftNav";
import Paper from "@/components/Paper";

const Profile = () => {
    const { isLoading } = useAuth();

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Profile" />
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 1" },
                        bgcolor: "white",
                    }}>
                    <LeftNav />
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <Paper>
                        <Box>
                            <Typography variant="h2">Your profile</Typography>
                            <Typography sx={{ marginBottom: 4 }}>
                                Your details are used when you make a data
                                access request application.
                            </Typography>
                            {isLoading ? (
                                <CircularProgress color="secondary" />
                            ) : (
                                <ProfileForm />
                            )}
                        </Box>
                    </Paper>
                </Box>
            </BoxContainer>
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

export default Profile;
