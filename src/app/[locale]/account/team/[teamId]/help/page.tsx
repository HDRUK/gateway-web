import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { ACCOUNT, HELP, PAGES, TEAM, TITLE } from "@/consts/translation";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Help",
    description: "",
};

const TeamHelpPage = () => {
    const t = useTranslations(`${PAGES}.${ACCOUNT}.${TEAM}.${HELP}`);

    return (
        <Paper>
            <Box>
                <Typography variant="h2">{t(TITLE)}</Typography>
            </Box>
        </Paper>
    );
};

export default TeamHelpPage;
