"use client";

import { useEffect, useState } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import { CohortRequest } from "@/interfaces/CohortRequest";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import CheckboxControlled from "@/components/CheckboxControlled";
import Link from "@/components/Link";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import CohortRequestTermsDialog from "../CohortRequestTermsDialog";

const COHORT_TRANSLATION_PATH = "pages.about.cohortDiscoveryRequest";

interface CohortDiscoveryRequestFormProps {
    cmsContent: templateRepeatFields;
    userId: number;
}

interface accessRequestType {
    redirect_url: string;
}

const CohortDiscoveryRequestForm = ({
    cmsContent,
    userId,
}: CohortDiscoveryRequestFormProps) => {
    const { push } = useRouter();
    const { showDialog } = useDialog();
    const t = useTranslations();

    const { data: userData, isLoading: isUserLoading } = useGet<CohortRequest>(
        `${apis.cohortRequestsV1Url}/user/${userId}`,
        {
            errorNotificationsOn: false,
        }
    );

    const { data: accessData, isLoading: isAccessLoading } =
        useGet<accessRequestType>(`${apis.cohortRequestsV1Url}/access`, {
            errorNotificationsOn: false,
        });

    const handleSubmit = () => {
        showDialog(CohortRequestTermsDialog, { cmsContent });
    };

    const handleCancel = () => {
        push(`/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`);
    };

    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    useEffect(() => {
        if (!isUserLoading && !isAccessLoading) {
            if (accessData?.redirect_url) {
                push(accessData.redirect_url);
            } else if (
                userData?.request_status &&
                userData.request_status === "APPROVED"
            ) {
                push(`/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`);
            }
        }
    }, [isUserLoading, isAccessLoading, accessData, userData, push]);

    return !isUserLoading && !isAccessLoading ? (
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
                        <Typography component="span" color={colors.red600}>
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
                    <Typography component="div">
                        {t.rich(`${COHORT_TRANSLATION_PATH}.statement1`, {
                            list: chunks => <ol>{chunks}</ol>,
                            item: chunks => <li>{chunks}</li>,
                        })}
                    </Typography>
                    <Typography component="div">
                        {t.rich(`${COHORT_TRANSLATION_PATH}.statement2`, {
                            list: chunks => <ol>{chunks}</ol>,
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
    ) : null;
};

export default CohortDiscoveryRequestForm;
