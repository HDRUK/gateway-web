"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";

const TRANSLATIONS_NAMESPACE_RELEASES = "pages.releases";

const IntroContent = () => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_RELEASES);
    return (
        <Box
            sx={{
                bgcolor: "transparent",
                padding: {
                    mobile: "20px 40px",
                    tablet: "40px 100px 20px",
                    desktop: "40px 120px 20px",
                },
            }}>
            <p>{t("description1")}</p>
            <p>{t("description2")}</p>
        </Box>
    );
};

export default IntroContent;
