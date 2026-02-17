"use client";

import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@/components/Box";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";
import { useFeatures } from "@/providers/FeatureProvider";

const TRANSLATION_PATH = "components.CohortDiscoveryInfo";
const TRANSLATION_PATH_MODAL = "pages.account.profile.cohortDiscovery";

const CohortAccessButtons = () => {
    const { user } = useAuth();
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const t = useTranslations(TRANSLATION_PATH);
    const tModal = useTranslations(TRANSLATION_PATH_MODAL);
    const { push } = useRouter();
    const { showModal } = useModal();

    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/indicate_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    return (
        <>
            <Box sx={{ p: 0 }}>
                {isNhsSdeApplicationsEnabled && (
                    <Typography sx={{ py: 1 }}>{t("step1")}</Typography>
                )}
                <RequestNhseSdeAccessButton />
            </Box>
            <Box sx={{ p: 0 }}>
                {isNhsSdeApplicationsEnabled && (
                    <Typography sx={{ py: 1 }}>{t("step2")}</Typography>
                )}
                <IndicateNhseSdeAccessButton
                    sx={{ width: "100%" }}
                    action={() => {
                        showModal({
                            content: (
                                <Stack sx={{ gap: 2 }}>
                                    <Typography
                                        variant="h2"
                                        sx={{ mt: 2, mb: 1 }}>
                                        {tModal("nhseSdeTitle")}
                                    </Typography>
                                    <Typography
                                        color={theme.palette.error.main}>
                                        {tModal("nhseSdeText2")}
                                    </Typography>
                                </Stack>
                            ),
                            showCancel: true,
                            showConfirm: true,
                            cancelText: "Close",
                            confirmText:
                                "Confirm approval by the NHS Research SDE",
                            onSuccess: async () => {
                                const result = await submitRequest({});
                                if (result) {
                                    revalidateCacheAction(
                                        `cohort-user-${user?.id}`
                                    );
                                }
                            },
                        });

                        push(
                            `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}`
                        );
                    }}
                />
            </Box>
        </>
    );
};

export default CohortAccessButtons;
