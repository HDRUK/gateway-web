"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Link from "@/components/Link";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";
import CohortRequestTermsDialog from "../CohortRequestTermsDialog";

const COHORT_TRANSLATION_PATH = "pages.about.cohortDiscoveryRequest";

interface CohortDisoveryRequestFormProps {
    cmsContent: templateRepeatFields;
}

const CohortDisoveryRequestForm = ({
    cmsContent,
}: CohortDisoveryRequestFormProps) => {
    const { push } = useRouter();
    const { showDialog } = useDialog();
    const t = useTranslations();

    const handleSubmit = () => {
        showDialog(CohortRequestTermsDialog, { cmsContent });
    };

    const handleCancel = () => {
        push(`/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`);
    };

    return (
        <BoxContainer
            sx={{
                p: 4,
            }}>
            <Paper sx={{ mb: 2 }}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h2">
                        {t(`${COHORT_TRANSLATION_PATH}.title`)}
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                        {t.rich(`${COHORT_TRANSLATION_PATH}.text`, {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            userprofile: chunks => (
                                <Link
                                    href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`}>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </Typography>
                    <Typography>
                        {t.rich(`${COHORT_TRANSLATION_PATH}.terms`, {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            terms: chunks => (
                                <Link href={`/${RouteName.TERMS}`}>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </Typography>
                </Box>
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}>
                <Button onClick={handleSubmit}>{t("common.submit")}</Button>
                <Button variant="text" onClick={handleCancel}>
                    {t("common.cancel")}
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default CohortDisoveryRequestForm;
