import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const Verification = ({ hasFailed }: { hasFailed: boolean }) => {
    const t = useTranslations("pages.emailVerification");

    const message = hasFailed ? t("fail") : t("pass");

    return (
        <Paper>
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("title")}</Typography>
                <Typography sx={{ marginBottom: 4 }}>{message}</Typography>
            </Box>
        </Paper>
    );
};

export default Verification;
