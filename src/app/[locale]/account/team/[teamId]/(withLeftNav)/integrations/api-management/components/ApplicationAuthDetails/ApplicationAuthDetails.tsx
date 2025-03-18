import { useTranslations } from "next-intl";
import { Application } from "@/interfaces/Application";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CopyableCard from "@/components/CopyableCard";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

interface ApplicationAuthDetailsProps {
    application?: Application;
    handleGenerateId: () => void;
}

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement`;

const ApplicationAuthDetails = ({
    application,
    handleGenerateId,
}: ApplicationAuthDetailsProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const credentials = [
        {
            label: t("appId"),
            value: application?.app_id,
            description: t("appDescription"),
        },
        {
            label: t("clientId"),
            value: application?.client_id,
            description: t("clientDescription"),
        },
    ];

    return (
        <>
            <Paper
                sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: 2,
                }}>
                <Typography variant="h2">{t("authTitle")}</Typography>
                <Typography>{t("authIntro")}</Typography>
            </Paper>

            <BoxContainer>
                <Card
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { laptop: "3fr 1fr" },
                    }}>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                            }}>
                            {t("authSettingsTitle")}
                        </Typography>
                        <Typography>{t("authSettingsIntro")}</Typography>
                    </Box>
                    <Box sx={{ justifySelf: { laptop: "flex-end" } }}>
                        <Button onClick={handleGenerateId}>
                            {t("generateClientId")}
                        </Button>
                    </Box>
                </Card>
                {credentials.map(cred => (
                    <CopyableCard key={cred.label} {...cred} />
                ))}
            </BoxContainer>
        </>
    );
};

export default ApplicationAuthDetails;
