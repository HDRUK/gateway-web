"use client";

import { useTranslations } from "next-intl";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { IFrameWrapper } from "@/styles/IFrameContainer.styles";

const PLAYLIST_ID = "PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b";
const EMBED_URL = `https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0`;

const LearnMoreWidget = () => {
    const t = useTranslations("pages.account.dashboard.learnMore");

    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
                {t("title")}
            </Typography>
            <IFrameWrapper>
                <iframe
                    src={EMBED_URL}
                    title={t("title")}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    style={{ border: 0 }}
                />
            </IFrameWrapper>
        </Paper>
    );
};

export default LearnMoreWidget;
