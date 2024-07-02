import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { SupportCohortDiscoveryPageFAQs } from "@/interfaces/Support";

interface FAQsProps {
    data: SupportCohortDiscoveryPageFAQs[];
}

const TRANSLATION_NAMESPACE = "pages.support";

export default function FAQs({ data }: FAQsProps) {
    const t = useTranslations(TRANSLATION_NAMESPACE);

    return (
        <div>
            <Typography variant="h2" sx={{ mb: 3 }}>
                {t("faqs.title")}
            </Typography>
            {data.map(({ question, answer }) => (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" sx={{ mb: 3 }}>
                        {question}
                    </Typography>
                    <Typography>{answer}</Typography>
                </Box>
            ))}
        </div>
    );
}
