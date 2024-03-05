import * as React from "react";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Header from "@/components/Header";
import HomepageTitlePanel from "@/components/HomepageTitlePanel";

export default function HomePage() {
    const t = useTranslations("pages.home");

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                background:
                    "linear-gradient(97deg, #46AF93 4.05%, #475DA7 100%)",
            }}>
            <Header isHome />
            <main>
                <Container
                    sx={{
                        gridTemplateColumns: "repeat(5, 1fr)",
                    }}>
                    <Box sx={{ p: { mobile: 2, desktop: 5 } }}>
                        <HomepageTitlePanel
                            image="/images/homepage/welcome-image.png"
                            text={t("text")}
                            title={t("title")}
                        />
                    </Box>
                </Container>
            </main>
        </Container>
    );
}
