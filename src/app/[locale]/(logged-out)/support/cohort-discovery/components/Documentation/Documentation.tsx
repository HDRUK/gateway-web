import { Box, Divider, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface DocumentationProps {
    content: string;
}

const TRANSLATION_NAMESPACE = "pages.support";

export default function FAQs({ content }: DocumentationProps) {
    const t = useTranslations(TRANSLATION_NAMESPACE);

    return (
        <div>
            <Typography variant="h2" sx={{ mb: 2 }}>
                {t("documentation.title")}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
        </div>
    );
}
