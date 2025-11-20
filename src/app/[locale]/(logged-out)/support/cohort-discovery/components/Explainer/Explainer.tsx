import { Box, Divider, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface ExplainerProps {
    src: string;
}

const TRANSLATION_NAMESPACE = "pages.support";

export default function Explainer({ src }: ExplainerProps) {
    const t = useTranslations(TRANSLATION_NAMESPACE);

    const fileType = src.match(/\.([^.]+)$/)?.[1] || "mp4";

    return (
        <>
            <Typography variant="h2" sx={{ mb: 2 }}>
                {t("explainer.title")}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <video controls width="100%">
                    <source src={src} type={`video/${fileType}`} />
                    <p>{t("explainer.unsupportedVideo")}</p>{" "}
                </video>
            </Box>
            <Divider sx={{ mb: 2 }} />
        </>
    );
}
