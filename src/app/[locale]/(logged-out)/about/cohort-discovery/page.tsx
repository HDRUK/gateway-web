import { Box } from "@mui/material";
import Button from "@/components/Button";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import { getCohortDiscovery1 } from "@/utils/cms";
import metaData from "@/utils/metadata";
import CtaOverride from "./components/CtaOverride";

export const metadata = metaData({
    title: "Cohort Discovery - About",
    description: "",
});

export default async function CohortDiscoveryPage() {
    const cohortDiscovery = await getCohortDiscovery1();

    return (
        <>
            <Container>
                <Box
                    sx={{
                        bgcolor: "white",
                        pt: 4,
                        pb: 1,
                        px: 4,
                        mt: 5,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <Box sx={{ flexDirection: "column" }}>
                        <Typography variant="h2">Cohort Discovery</Typography>
                        <Typography variant="body1">
                            Learn about Cohort Discovery and gain access to the
                            service
                        </Typography>
                    </Box>
                    <Box>
                        {cohortDiscovery?.template.newCohortDiscoveryFieldGroup
                            .ctaLink && (
                            <CtaOverride
                                ctaLink={
                                    cohortDiscovery?.template
                                        .newCohortDiscoveryFieldGroup.ctaLink
                                }
                            />
                        )}
                    </Box>
                </Box>
                <Tabs
                    centered
                    tabBoxSx={{
                        elevation: 0,
                        boxShadow: 0,
                        bgcolor: "white",
                        mt: "2px",
                        mb: 3,
                    }}
                    rootBoxSx={{ padding: 0 }}
                    tabs={[
                        {
                            value: "about-cohort-discovery",
                            label: "About Cohort Discovery",
                            content: (
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                    }}>
                                    <Box
                                        sx={{
                                            p: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}>
                                        <Box sx={{ flex: 1 }}>
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        .newCohortDiscoveryFieldGroup
                                                        .firstPageText
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            {cohortDiscovery?.template
                                                .newCohortDiscoveryFieldGroup
                                                .firstPageMedia && (
                                                <HTMLContent
                                                    content={
                                                        cohortDiscovery
                                                            ?.template
                                                            .newCohortDiscoveryFieldGroup
                                                            .firstPageMedia
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                        },
                        {
                            value: "how-to-request-access",
                            label: "How to request access",
                            content: (
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                    }}>
                                    <Box
                                        sx={{
                                            p: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}>
                                        <Box
                                            sx={{
                                                flex: 1,
                                                alignItems: "flex-start",
                                            }}>
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        .newCohortDiscoveryFieldGroup
                                                        .secondPageText
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            {cohortDiscovery?.template
                                                .newCohortDiscoveryFieldGroup
                                                .secondPageMedia && (
                                                <HTMLContent
                                                    content={
                                                        cohortDiscovery
                                                            ?.template
                                                            .newCohortDiscoveryFieldGroup
                                                            .secondPageMedia
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                        },
                        {
                            value: "security-and-confidentiality",
                            label: "Security and confidentiality",
                            content: (
                                <Box>
                                    <Box
                                        sx={{
                                            bgcolor: "white",
                                            p: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            mb: 3,
                                        }}>
                                        <Box sx={{ flex: 1 }}>
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        .newCohortDiscoveryFieldGroup
                                                        .thirdPageText
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            {cohortDiscovery?.template
                                                .newCohortDiscoveryFieldGroup
                                                .thirdPageMedia && (
                                                <HTMLContent
                                                    content={
                                                        cohortDiscovery
                                                            ?.template
                                                            .newCohortDiscoveryFieldGroup
                                                            .thirdPageMedia
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            bgcolor: "white",
                                            p: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "column",
                                        }}>
                                        <Box sx={{ flex: 1 }}>
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        .newCohortDiscoveryFieldGroup
                                                        .thirdPageTextPartTwo
                                                }
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                        },
                        {
                            value: "nhs-sde-network",
                            label: "NHS SDE Network",
                            content: (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "stretch",
                                        flexDirection: "column",
                                    }}>
                                    <Box
                                        sx={{
                                            bgcolor: "white",
                                            display: "flex",
                                            justifyContent: "center",
                                            mb: 3,
                                            gap: 2,
                                            py: 2,
                                        }}>
                                        <Button>
                                            Request access to NHS SDE Network
                                            datasets
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary">
                                            I have been approved by the NHS SDE
                                        </Button>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 3,
                                            bgcolor: "white",
                                            display: "flex",
                                            alignItems: "center",
                                        }}>
                                        <Box sx={{ flex: 1 }}>
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        .newCohortDiscoveryFieldGroup
                                                        .fourthPageText
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            {cohortDiscovery?.template
                                                .newCohortDiscoveryFieldGroup
                                                .fourthPageMedia && (
                                                <HTMLContent
                                                    content={
                                                        cohortDiscovery
                                                            ?.template
                                                            .newCohortDiscoveryFieldGroup
                                                            .fourthPageMedia
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                        },
                    ]}
                />
            </Container>
        </>
    );
}
