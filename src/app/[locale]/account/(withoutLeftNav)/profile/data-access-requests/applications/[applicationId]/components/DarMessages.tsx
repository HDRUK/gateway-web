import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Divider, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DarReviewsResponse } from "@/interfaces/DataAccessReview";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import notificationService from "@/services/notification";
import { inputComponents } from "@/config/forms";
import theme, { colors } from "@/config/theme";
import { CheckCircleIcon, ErrorIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import { addDarApplicationCommentTeamAction } from "@/app/actions/addDarApplicationCommentTeam";
import { addDarApplicationCommentUserAction } from "@/app/actions/addDarApplicationCommentUser";
import { createDarApplicationReviewAction } from "@/app/actions/createDarApplicationReview";

const DATE_FORMAT = "DD MMM YYYY HH:mm";
const ICON_SIZE = "20px";
const MESSAGE_HEADER = "245px";
const TEXT_AREA_MINIMISED = "43px";
const TEXT_AREA_EXPANDED = "160px";
const TRANSLATION_PATH = "components.DataAccessMessages";

interface DarMessagesProps {
    applicationId: string;
    teamId?: string;
    userId?: string;
    teamName?: string;
    initialReviews: DarReviewsResponse[];
    isResearcher: boolean;
    darApplicationEndpoint: string;
}

interface DarMessageForm {
    comment: string;
}

const searchFilter = {
    component: inputComponents.TextArea,
    variant: "outlined",
    name: "comment",
    label: "",
};

const DarMessages = ({
    applicationId,
    teamId,
    userId,
    teamName,
    initialReviews,
    isResearcher,
    darApplicationEndpoint,
}: DarMessagesProps) => {
    const { user } = useAuth();
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();

    const {
        data: reviews,
        mutate: mutateReviews,
        isLoading: loadingReviews,
    } = useGet<DarReviewsResponse[]>(
        `${darApplicationEndpoint}/${applicationId}/reviews`,
        {
            keepPreviousData: true,
            errorNotificationsOn: false,
            fallbackData: initialReviews,
            revalidateOnMount: false,
        }
    );

    const { control, reset, getValues, watch } = useForm<DarMessageForm>({
        defaultValues: {
            comment: "",
        },
    });

    const commentText = watch("comment");

    const sendMessage = async () => {
        let response;

        if (!reviews?.length && !isResearcher) {
            response = await createDarApplicationReviewAction(
                applicationId,
                teamId!,
                {
                    comment: getValues("comment"),
                }
            );
        }

        if (reviews?.length) {
            response = isResearcher
                ? await addDarApplicationCommentUserAction(
                      applicationId,
                      reviews[0].comments[0].review_id.toString(),
                      userId!,
                      {
                          comment: getValues("comment"),
                      }
                  )
                : await addDarApplicationCommentTeamAction(
                      applicationId,
                      reviews[0].comments[0].review_id.toString(),
                      teamId!,
                      {
                          comment: getValues("comment"),
                      }
                  );
        }

        if (response) {
            showModal({
                showCancel: false,
                showConfirm: false,
                autoCloseTimeout: 5000,
                title: t("modalTitle"),
                content: t("modalContent"),
            });

            reset();
            mutateReviews();
        } else {
            notificationService.apiError("ERROR");
        }
    };

    const commentsEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom when comments change
    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [reviews]);

    const [isInputHovered, setIsInputHovered] = useState<boolean>();

    const reviewComments = useMemo(
        () => !!reviews?.length && reviews[0].comments,
        [reviews]
    );

    const actionRequiredApplicant = useMemo(
        () =>
            reviewComments &&
            !reviewComments[reviewComments.length - 1].user_id,
        [reviewComments]
    );

    return (
        <Box sx={{ height: "100%", p: 0 }}>
            <Box sx={{ p: 3 }}>
                {actionRequiredApplicant !== undefined && reviewComments && (
                    <>
                        <Typography
                            variant="h2"
                            component="p"
                            color={colors.purple500}>
                            {t("status")}
                        </Typography>
                        <Typography
                            sx={{
                                display: "flex",
                                color: colors.grey700,
                                mb: 3,
                            }}>
                            {(actionRequiredApplicant && isResearcher) ||
                            (!actionRequiredApplicant && !isResearcher) ? (
                                <ErrorIcon
                                    sx={{
                                        pr: 1,
                                        color: colors.amber500,
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                        p: 0,
                                        mr: 1,
                                    }}
                                    fontSize="large"
                                />
                            ) : (
                                <CheckCircleIcon
                                    sx={{
                                        pr: 1,
                                        color: colors.green400,
                                        height: ICON_SIZE,
                                        width: ICON_SIZE,
                                        p: 0,
                                        mr: 1,
                                    }}
                                    fontSize="large"
                                />
                            )}
                            {t("actionRequiredBy")}
                            {actionRequiredApplicant
                                ? "Applicant"
                                : "Custodian"}
                        </Typography>
                    </>
                )}

                <Typography variant="h2" component="p" color={colors.purple500}>
                    {t("messagingDashboard")}
                </Typography>
                <Typography>{t("messagingContent")}</Typography>
            </Box>

            <Divider />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: `calc(100% - ${MESSAGE_HEADER})`,
                    minHeight: "300px",
                }}>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        pt: 0,
                        pb: 0,
                    }}>
                    {loadingReviews ? (
                        <Loading />
                    ) : (
                        !!reviewComments &&
                        reviewComments.map(review => (
                            <Box
                                key={review.id}
                                sx={{
                                    borderRadius: theme.spacing(1),
                                    backgroundColor: review.user_id
                                        ? colors.grey100
                                        : colors.green50,
                                    mb: 2,
                                    width: "70%",
                                    alignSelf: review.user_id
                                        ? "flex-start"
                                        : "flex-end",
                                }}>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Typography
                                        color={colors.grey600}
                                        fontSize={13}>
                                        {review.user_id
                                            ? `${user?.firstname} ${user?.lastname}`
                                            : teamName}
                                    </Typography>
                                    <Typography
                                        color={colors.grey600}
                                        fontSize={13}>
                                        {formatDate(
                                            review.created_at,
                                            DATE_FORMAT
                                        )}
                                    </Typography>
                                </Box>
                                <Typography sx={{ pt: 1 }}>
                                    {review.comment}
                                </Typography>
                            </Box>
                        ))
                    )}
                    <div ref={commentsEndRef} />
                </Box>

                <Divider />

                <BoxContainer>
                    <Box sx={{ pb: 0, pt: 4 }}>
                        <Typography>{t("reply")}</Typography>
                        <Typography>{t("replyInfo")}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            pt: 0,
                            pb: 0,
                            width: "100%",
                        }}>
                        <InputWrapper
                            control={control}
                            {...searchFilter}
                            formControlSx={{ flexGrow: 1, mb: 0 }}
                            onFocus={() => setIsInputHovered(true)}
                            onBlur={() => setIsInputHovered(false)}
                            sx={{
                                height: isInputHovered
                                    ? TEXT_AREA_EXPANDED
                                    : TEXT_AREA_MINIMISED,
                                transition: "all 0.2s ease",
                                ">textarea": {
                                    height: "100% !important",
                                },
                            }}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!commentText.length}
                            sx={{
                                alignSelf: "flex-end",
                                height: TEXT_AREA_MINIMISED,
                            }}>
                            {t("send")}
                        </Button>
                    </Box>
                </BoxContainer>
            </Box>
        </Box>
    );
};

export default DarMessages;
