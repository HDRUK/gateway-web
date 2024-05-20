import { useTranslations } from "next-intl";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.createPage`;

const Header = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <>
            <BackButton label={t("back")} />
            <BoxContainer sx={{ gap: 0, mb: 1 }}>
                <Paper>
                    <Box sx={{ bgcolor: "white", mb: 0 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("text")}</Typography>
                    </Box>
                </Paper>
            </BoxContainer>
        </>
    );
};
export default Header;
