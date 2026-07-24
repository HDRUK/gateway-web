import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { CohortDiscoveryTemplate } from "@/interfaces/Cms";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import CohortDiscoveryButton from "../CohortDiscoveryButton";
import HTMLVideoEmbed from "./HTMLVideoEmbed";
import StepList from "./StepList";

const TRANSLATION_PATH = "components.CohortDiscoveryInfo";
const TEXT_COLUMN_MAX_WIDTH = 900;

const CohortDiscoveryInfo = async ({
    cohortDiscovery,
    showAccessButton = false,
}: {
    cohortDiscovery?: CohortDiscoveryTemplate | null;
    showAccessButton?: boolean;
}) => {
    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <Container>
            <Box
                sx={{
                    bgcolor: "common.white",
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
                    <Typography variant="h2">{t("title")}</Typography>
                    <Typography variant="body1">{t("learnAbout")}</Typography>
                </Box>
                {showAccessButton && (
                    <CohortDiscoveryButton showDatasetExplanatoryTooltip />
                )}
            </Box>
            <Tabs
                centered
                tabBoxSx={{
                    elevation: 0,
                    boxShadow: 0,
                    bgcolor: "common.white",
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
                                    bgcolor: "common.white",
                                    p: { mobile: 2, laptop: 4 },
                                }}>
                                <Box sx={{ maxWidth: TEXT_COLUMN_MAX_WIDTH }}>
                                    <HTMLContent
                                        content={
                                            cohortDiscovery?.template
                                                ?.newCohortDiscoveryFieldGroup
                                                .firstPageText ?? ""
                                        }
                                    />
                                    <Typography
                                        variant="h2"
                                        sx={{ mt: 2, mb: 3 }}>
                                        {t("whatCanIDo")}
                                    </Typography>
                                    <StepList
                                        steps={
                                            cohortDiscovery?.template
                                                ?.newCohortDiscoveryFieldGroup
                                                .firstPageSteps ?? []
                                        }
                                    />
                                </Box>
                                <Box sx={{ mt: 4 }}>
                                    <HTMLVideoEmbed
                                        content={
                                            cohortDiscovery?.template
                                                ?.newCohortDiscoveryFieldGroup
                                                .firstPageMedia
                                        }
                                    />
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
                                    bgcolor: "common.white",
                                    p: { mobile: 2, laptop: 4 },
                                }}>
                                <Box sx={{ maxWidth: TEXT_COLUMN_MAX_WIDTH }}>
                                    <HTMLContent
                                        content={
                                            cohortDiscovery?.template
                                                ?.newCohortDiscoveryFieldGroup
                                                .secondPageText ?? ""
                                        }
                                    />
                                    <Box sx={{ mt: 3 }}>
                                        <StepList
                                            steps={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .secondPageSteps ?? []
                                            }
                                        />
                                    </Box>
                                </Box>
                                {cohortDiscovery?.template
                                    ?.newCohortDiscoveryFieldGroup
                                    .secondPageMedia && (
                                    <Box sx={{ flex: 1 }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .secondPageMedia
                                            }
                                        />
                                    </Box>
                                )}
                            </Box>
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
                                        bgcolor: "common.white",
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
                                        bgcolor: "common.white",
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
                            <Box
                                sx={{
                                    bgcolor: "common.white",
                                    p: { mobile: 2, laptop: 4 },
                                }}>
                                <Box sx={{ maxWidth: TEXT_COLUMN_MAX_WIDTH }}>
                                    <HTMLContent
                                        content={
                                            cohortDiscovery?.template
                                                ?.newCohortDiscoveryFieldGroup
                                                .fourthPageText ?? ""
                                        }
                                    />
                                    <Box sx={{ mt: 3 }}>
                                        <StepList
                                            steps={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .fourthPageSteps ?? []
                                            }
                                        />
                                    </Box>
                                </Box>
                                {cohortDiscovery?.template
                                    ?.newCohortDiscoveryFieldGroup
                                    .fourthPageMedia && (
                                    <Box sx={{ flex: 1 }}>
                                        <HTMLContent
                                            content={
                                                cohortDiscovery?.template
                                                    ?.newCohortDiscoveryFieldGroup
                                                    .fourthPageMedia
                                            }
                                        />
                                    </Box>
                                )}
                            </Box>
                        ),
                    },
                ]}
            />
        </Container>
    );
};

export default CohortDiscoveryInfo;
