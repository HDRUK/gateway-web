"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import ProfileForm from "./components/ProfileForm";

const ProfilePage = () => {
    const t = useTranslations("pages.account.profile");
    const { isLoading } = useAuth();
    const var1 = process.env.NEXT_PUBLIC_API_V1_URL;
    console.log(
        "CLIENT NEXT_PUBLIC_API_V1_URL: ",
        process.env.NEXT_PUBLIC_API_V1_URL
    );
    console.log("NEXT_PUBLIC_API_V1_URL as var: ", var1);

    const var2 = process.env.API_V1_URL;

    console.log("CLIENT API_V1_URL: ", process.env.API_V1_URL);
    console.log("API_V1_URL as var: ", var2);
    return (
        <Paper>
            <Box>
                <Typography variant="h2">{t("title")}</Typography>
                <Typography sx={{ marginBottom: 4 }}>{t("text")}</Typography>
                {isLoading ? <Loading /> : <ProfileForm />}
            </Box>
        </Paper>
    );
};

export default ProfilePage;
