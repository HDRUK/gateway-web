"use client";

import { useState } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import CheckboxControlled from "@/components/CheckboxControlled";
import Link from "@/components/Link";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
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

    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    return (
        <BoxContainer
            sx={{
                p: 4,
            }}>
            <Paper sx={{ mb: 2 }}>
                <Box sx={{ p: 4, pb: 2 }}>
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
                </Box>

                <Divider />

                <Box sx={{ p: 4, pt: 3 }}>
                    <Typography>
                        {t(`${COHORT_TRANSLATION_PATH}.userDeclaration`)}
                        <Typography component={"span"} color={colors.red600}>
                            *
                        </Typography>
                    </Typography>
                    <Typography color={colors.grey600} sx={{ mb: 1 }}>
                        {t(
                            `${COHORT_TRANSLATION_PATH}.userDeclarationAdditional`
                        )}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                        {t(`${COHORT_TRANSLATION_PATH}.statementIntro`)}
                    </Typography>
                    <Typography component={"div"}>
                        {t.rich(`${COHORT_TRANSLATION_PATH}.statement1`, {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            list: chunks => <ol>{chunks}</ol>,
                            // eslint-disable-next-line react/no-unstable-nested-components
                            item: chunks => <li>{chunks}</li>,
                        })}
                    </Typography>
                    <Typography component={"div"}>
                        {t.rich(`${COHORT_TRANSLATION_PATH}.statement2`, {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            list: chunks => <ol>{chunks}</ol>,
                            // eslint-disable-next-line react/no-unstable-nested-components
                            item: chunks => <li>{chunks}</li>,
                        })}
                    </Typography>
                    <Typography>
                        {t(`${COHORT_TRANSLATION_PATH}.statementOutro`)}
                    </Typography>
                    <CheckboxControlled
                        formControlSx={{ pt: 1 }}
                        label={t(`${COHORT_TRANSLATION_PATH}.checkboxLabel`)}
                        name="dataset-population-checkbox"
                        onChange={(_e, value) => setTermsAccepted(value)}
                    />
                </Box>
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}>
                <Button onClick={handleSubmit} disabled={!termsAccepted}>
                    {t("common.submit")}
                </Button>
                <Button variant="text" onClick={handleCancel}>
                    {t("common.cancel")}
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default CohortDisoveryRequestForm;
