import { Box } from "@mui/material";
import { CohortDiscoveryTemplate } from "@/interfaces/Cms";
import Container from "@/components/Container";
import CtaOverride from "@/components/CtaOverride";
import HTMLContent from "@/components/HTMLContent";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import IndicateNhseSdeAccessButton from "../IndicateNhseSdeAccessButton";
import RequestNhseSdeAccessButton from "../RequestNhseSdeAccessButton";
import { CohortDiscoveryTabContent } from "./CohortDiscoveryInfo.styles";

const CohortDiscoveryInfo = ({
    cohortDiscovery,
    showAccessButton = false,
}: {
    cohortDiscovery?: CohortDiscoveryTemplate;
    showAccessButton?: boolean;
}) => {
    return (
        <Container>
            <Box
                sx={{
                    bgcolor: "white",
                    pt: 4,
                    pb: 1,
                    px: 4,
                    mt: 1,
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
                {showAccessButton && (
                    <Box>
                        {cohortDiscovery?.template?.newCohortDiscoveryFieldGroup
                            .ctaLink && (
                            <CtaOverride
                                ctaLink={
                                    cohortDiscovery?.template
                                        ?.newCohortDiscoveryFieldGroup.ctaLink
                                }
                            />
                        )}
                    </Box>
                )}
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
                            <CohortDiscoveryTabContent
                                sx={{ bgcolor: "white" }}>
                                <Box
                                    sx={{
                                        p: 0,
                                        px: 1,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 2,
                                        flex: 1,
                                        flexDirection: {
                                            mobile: "column",
                                            laptop: "row",
                                        },
                                    }}>
                                    <Box sx={{ flex: 1 }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .firstPageText
                                            }
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {cohortDiscovery?.template
                                            ?.newCohortDiscoveryFieldGroup
                                            .firstPageMedia && (
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        ?.newCohortDiscoveryFieldGroup
                                                        .firstPageMedia
                                                }
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </CohortDiscoveryTabContent>
                        ),
                    },
                    {
                        value: "how-to-request-access",
                        label: "How to request access",
                        content: (
                            <CohortDiscoveryTabContent
                                sx={{ bgcolor: "white" }}>
                                <Box
                                    sx={{
                                        p: 0,
                                        px: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        flexDirection: {
                                            mobile: "column",
                                            laptop: "row",
                                        },
                                    }}>
                                    <Box
                                        sx={{
                                            flex: 1,
                                            alignItems: "flex-start",
                                        }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .secondPageText
                                            }
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {cohortDiscovery?.template
                                            ?.newCohortDiscoveryFieldGroup
                                            .secondPageMedia && (
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        ?.newCohortDiscoveryFieldGroup
                                                        .secondPageMedia
                                                }
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </CohortDiscoveryTabContent>
                        ),
                    },
                    {
                        value: "security-and-confidentiality",
                        label: "Security and confidentiality",
                        content: (
                            <Box
                                sx={{
                                    overflowY: "auto",
                                    height: "620px",
                                    justifySelf: "center",
                                }}>
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: {
                                            mobile: "column",
                                            laptop: "row",
                                        },
                                        mb: 3,
                                    }}>
                                    <Box sx={{ flex: 1 }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .thirdPageText
                                            }
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {cohortDiscovery?.template
                                            ?.newCohortDiscoveryFieldGroup
                                            .thirdPageMedia && (
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        ?.newCohortDiscoveryFieldGroup
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
                                                    ?.newCohortDiscoveryFieldGroup
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
                        label: "NHS Research SDE Network",
                        content: (
                            <CohortDiscoveryTabContent
                                sx={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    flexDirection: "column",
                                    p: 0,
                                }}>
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 2,
                                        gap: 2,
                                        py: 2,
                                    }}>
                                    <RequestNhseSdeAccessButton />
                                    <IndicateNhseSdeAccessButton />
                                </Box>
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: "white",
                                        display: "flex",
                                        gap: 5,
                                        flexDirection: {
                                            mobile: "column",
                                            laptop: "row",
                                        },
                                        flexGrow: 1,
                                    }}>
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                        }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .fourthPageText
                                            }
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            overflowY: {
                                                laptop: "auto",
                                                mobile: "visible",
                                            },
                                            justifySelf: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}>
                                        {cohortDiscovery?.template
                                            ?.newCohortDiscoveryFieldGroup
                                            .fourthPageMedia && (
                                            <HTMLContent
                                                content={
                                                    cohortDiscovery?.template
                                                        ?.newCohortDiscoveryFieldGroup
                                                        .fourthPageMedia
                                                }
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </CohortDiscoveryTabContent>
                        ),
                    },
                ]}
            />
        </Container>
    );
};

export default CohortDiscoveryInfo;
