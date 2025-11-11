"use client";

import { useEffect, useState, useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import {
    Grid,
    Typography,
    SvgIconTypeMap,
    Tooltip,
    IconButton,
    keyframes,
    Box,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import * as yup from "yup";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import { formatDate, getToday } from "@/utils/date";
import InputWrapper from "../InputWrapper";

interface Ratings {
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
    rating: number;
    colour: string;
}

const cookieName = "surveySession";
const cookieLife = 90; // days
const cookieLifeShort = 1; // days

const ratings: Ratings[] = [
    { icon: MoodBadIcon, rating: 1, colour: colors.red700 },
    { icon: SentimentVeryDissatisfiedIcon, rating: 2, colour: colors.orange },
    { icon: SentimentSatisfiedIcon, rating: 3, colour: colors.orange200 },
    { icon: SentimentSatisfiedAltIcon, rating: 4, colour: colors.darkGreen100 },
    { icon: InsertEmoticonIcon, rating: 5, colour: colors.green400 },
];

const displayIn = 150000;
const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;
const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
`;

const validMonths = ["01", "04", "07", "10"];

interface CustomerSurveyProps {
    hideOnLoad?: boolean;
}

const surveySchema = yup.object({
    reason: yup.string().max(500, "Max 500 characters"),
    score: yup.number().required(),
});

export default function CustomerSurvey({
    hideOnLoad = true,
}: CustomerSurveyProps) {
    const t = useTranslations("components.CustomerSurvey");
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only("mobile"));

    const [hideComponent, setHideComponent] = useState(hideOnLoad);
    const [submitted, setSubmitted] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [step, setStep] = useState<"rating" | "reason" | "complete">(
        "rating"
    );
    const [sessionId, setSessionId] = useState<string | null>(null);

    const boxSize = isMobile ? 375 : 600;

    const id = useId();
    const reason = {
        label: t("label"),
        name: "reason",
        component: inputComponents.TextArea,
        limit: 500,
    };
    const post = usePost(apis.customerSatisfactionV1Url, {
        successNotificationsOn: false,
    });
    const patch = usePatch(apis.customerSatisfactionV1Url, {
        successNotificationsOn: false,
    });

    const { control, handleSubmit, watch, setValue } = useForm({
        mode: "onTouched",
        resolver: yupResolver(surveySchema),
        defaultValues: {
            reason: "",
            score: null,
        },
    });

    const selectedScore = watch("score");

    const dismissSurvey = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setHideComponent(true);
            setSubmitted(true);
        }, 500);
    };

    const handleClick = async (score: number) => {
        const cookie = Cookies.get(cookieName);

        if (cookie) {
            const { score: storedScore } = JSON.parse(cookie);

            if (storedScore === score) return;

            setValue("score", score);
            return;
        }

        try {
            const response = await post({ score });
            const id = response?.id;
            if (id) {
                Cookies.set(cookieName, JSON.stringify({ score, id }), {
                    expires: cookieLife,
                });
                setSessionId(id);
                setValue("score", score);
                setStep("reason");
            }
        } catch (error) {
            console.error("Failed to submit score", error);
        }
    };

    const onSubmit = async ({ reason, score }) => {
        if (!sessionId) return;
        try {
            await patch(`${sessionId}`, { reason, score });
            setStep("complete");
            setTimeout(dismissSurvey, 2000);
        } catch (error) {
            console.error("Failed to submit reason", error);
        }
    };

    const handleClose = () => {
        // Create a short lifetime cookie to avoid survey reappearing
        Cookies.set(cookieName, JSON.stringify({ id }), {
            expires: cookieLifeShort,
        });

        setAnimateOut(true);
        setTimeout(() => {
            setHideComponent(true);
            setSubmitted(false);
        }, 500);
    };
    const checkToShowSurvey = useCallback(() => {
        if (!Cookies.get(cookieName)) {
            setAnimateOut(false);
            setHideComponent(false);
        }
    }, []);

    useEffect(() => {
        setHideComponent(hideOnLoad);
        setSubmitted(false);
    }, [pathname, hideOnLoad]);

    useEffect(() => {
        if (!hideComponent)
            return () => {
                /** No cleanup needed when hidden */
            };
        const timeoutId = setTimeout(checkToShowSurvey, displayIn);
        return () => clearTimeout(timeoutId);
    }, [hideComponent, checkToShowSurvey]);

    const isValidMonth = () => {
        const currentMonth = formatDate(getToday(), "MM");

        if (!currentMonth) {
            return false;
        }

        return validMonths.includes(currentMonth);
    };

    if (hideComponent || submitted) return null;

    if (!isValidMonth()) return null;

    return (
        <Box
            aria-describedby={id}
            sx={{
                textAlign: "center",
                padding: 2,
                background: "white",
                position: "fixed",
                bottom: isMobile ? 30 : 0,
                left: `calc(50% - ${boxSize / 2}px)`,
                width: boxSize,
                zIndex: 1400,
                animation: `${animateOut ? slideOut : slideIn} 0.5s ease-out`,
            }}>
            <IconButton
                sx={{ position: "absolute", top: 10, right: 10 }}
                onClick={handleClose}>
                <CloseIcon />
            </IconButton>

            <Typography
                variant="h6"
                gutterBottom
                id={id}
                width={isMobile ? "90%" : "100%"}>
                {t("title")}
            </Typography>

            {step === "rating" && (
                <Grid container spacing={1} justifyContent="center">
                    {ratings.map(({ icon: Icon, rating, colour }, index) => (
                        <Grid item key={rating}>
                            <Tooltip title={t(`tooltip-${index}`)}>
                                <div>
                                    <IconButton
                                        onClick={() => handleClick(rating)}
                                        id={`feedback-${rating}`}
                                        sx={{
                                            border:
                                                selectedScore === rating
                                                    ? `2px solid ${colour}`
                                                    : "",
                                        }}>
                                        <Icon
                                            aria-label={`Rating ${rating}`}
                                            sx={{
                                                cursor: "pointer",
                                                color: colour,
                                                minWidth: {
                                                    mobile: "30px",
                                                    tablet: "75px",
                                                },
                                                minHeight: {
                                                    mobile: "30px",
                                                    tablet: "75px",
                                                },
                                                margin: 1,
                                                fontSize: 1,
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            )}

            {step === "reason" && (
                <Box mt={2} component="form" onSubmit={handleSubmit(onSubmit)}>
                    <InputWrapper control={control} {...reason} />

                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={!watch("reason")?.trim()}>
                        {t("submit")}
                    </Button>
                </Box>
            )}

            {step === "complete" && <Typography>{t("success")}</Typography>}
        </Box>
    );
}
