import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ProfileForm from "@/modules/profile/ProfileForm";
import useAuth from "@/hooks/useAuth";
import { CircularProgress } from "@mui/material";
import LeftNav from "@/modules/LeftNav";

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
                    <h2 style={{ marginBottom: "10px" }}>Your profile</h2>
                    <p>
                        Your details are used when you make a data access
                        request application.
                    </p>
                    {isLoading ? (
                        <CircularProgress color="secondary" />
                    ) : (
                        <ProfileForm />
                    )}
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
