import { Box, Divider, Typography } from "@mui/material";
import { getCohortDiscoverySupportPageQuery } from "@/utils/cms";
import SupportPage from "../components/SupportPage";
import Explainer from "./components/Explainer";
import FAQs from "./components/FAQs";

export default async function CohortDiscovery() {
    const data = await getCohortDiscoverySupportPageQuery();

    const {
        supportCohortDiscovery: {
            documentation,
            faqs,
            explainer: {
                node: { sourceUrl },
            },
        },
    } = data;

    return (
        <SupportPage title={data?.title}>
            {sourceUrl && <Explainer src={sourceUrl} />}
            {documentation && (
                <Box>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Documentation
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <div
                            dangerouslySetInnerHTML={{ __html: documentation }}
                        />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                </Box>
            )}
            <FAQs data={faqs} />
        </SupportPage>
    );
}
