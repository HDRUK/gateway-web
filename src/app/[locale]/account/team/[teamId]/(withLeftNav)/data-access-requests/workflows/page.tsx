import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    DATA_ACCESS_REQUESTS,
    PAGES,
    TEAM,
    TITLE,
    WORKFLOWS,
} from "@/consts/translation";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Workflows",
    description: "",
};

const TeamHelpPage = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATA_ACCESS_REQUESTS}.${WORKFLOWS}`
    );

    return (
        <Paper>
            <Box>
                <Typography variant="h2">{t(TITLE)}</Typography>
            </Box>
        </Paper>
    );
};

export default TeamHelpPage;
