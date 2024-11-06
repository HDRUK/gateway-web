import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { ACCOUNT, HELP, PAGES, TEAM, TITLE } from "@/consts/translation";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Help - My Account",
        description: "",
    },
    noFollowRobots
);
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
