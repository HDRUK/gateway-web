import { getTranslations } from "next-intl/server";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { getMetrics } from "@/utils/api";
import metaData from "@/utils/metadata";
import MetricsGrid from "./components/DatasetsContent";

export const metadata = metaData({
    title: "Statistics",
    description: "",
});

const TRANSLATION_PATH = "pages.statistics";

export default async function StatisticsPage() {
    const t = await getTranslations(TRANSLATION_PATH);
    const metrics = await getMetrics();

    return (
        <>
            <Banner title={t("title")} />
            <Container
                sx={{
                    background: "white",
                    p: 10,
                    alignContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                }}>
                <MetricsGrid metrics={metrics} />

                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ alignSelf: "center" }}
                    href="/">
                    {t("backtoHomepage")}
                </Button>
            </Container>
        </>
    );
}
