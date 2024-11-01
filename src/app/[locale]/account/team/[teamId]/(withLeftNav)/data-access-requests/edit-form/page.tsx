import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    DATA_ACCESS_REQUESTS,
    EDIT_FORM,
    PAGES,
    TEAM,
    TITLE,
} from "@/consts/translation";
import metaData, { noFollowRobots } from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "Edit Form - My Account",
        description: "",
    },
    noFollowRobots
);
const TeamHelpPage = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATA_ACCESS_REQUESTS}.${EDIT_FORM}`
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
