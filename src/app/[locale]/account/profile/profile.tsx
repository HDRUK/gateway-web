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
