import { getTranslations } from "next-intl/server";
import Box from "@/components/Box";
import Container from "@/components/Container";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { getUserFromCookie } from "@/utils/api";
import { getCohortTermsAndConditions } from "@/utils/cms";
import metaData from "@/utils/metadata";
import CohortDiscoveryRequestForm from "./components/CohortDiscoveryRequestForm";

export const metadata = metaData({
    title: "Cohort Discovery Request - About",
    description: "",
});

export default async function CohortDiscoryRegister() {
    const t = await getTranslations("pages.account.profile.cohortDiscovery");
    const user = await getUserFromCookie();

    const content = await getCohortTermsAndConditions();

    const {
        template: { repeatfields },
    } = content;

    return (
        <ProtectedAccountRoute loggedInOnly={!!user?.id}>
            <Container sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ bgcolor: "white", mb: 3, px: 4, pb: 1, pt: 3 }}>
                    <Typography variant="h2" component={"h1"}>
                        {t("title")}
                    </Typography>
                    <Typography>{t("headerText")}</Typography>
                </Box>

                <CohortDiscoveryRequestForm
                    userId={user?.id}
                    cmsContent={repeatfields}
                />
            </Container>
        </ProtectedAccountRoute>
    );
}
