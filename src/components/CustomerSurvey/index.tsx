"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { colors } from "@/config/theme";

interface Ratings {
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
    rating: number;
    colour: string;
}

const cookieName = "surveySubmitted";
const cookieLife = 90; // days

const ratings: Ratings[] = [
    { icon: MoodBadIcon, rating: 1, colour: colors.red700 },
    { icon: SentimentVeryDissatisfiedIcon, rating: 2, colour: colors.orange },
    { icon: SentimentSatisfiedIcon, rating: 3, colour: colors.orange200 },
    { icon: SentimentSatisfiedAltIcon, rating: 4, colour: colors.darkGreen100 },
    { icon: InsertEmoticonIcon, rating: 5, colour: colors.green400 },
];

const displayIn = 150000;
const boxSize = 600;
const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;
const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
`;

interface CustomerSurveyProps {
    hideOnLoad: boolean;
}

export default function CustomerSurvey({
    hideOnLoad = true,
}: CustomerSurveyProps) {
    const t = useTranslations("components.CustomerSurvey");
    const pathname = usePathname();
    const [hideComponent, setHideComponent] = useState(hideOnLoad);
    const [submitted, setSubmitted] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    const handleSubmit = usePost(apis.customerSatisfactionV1Url, {
        successNotificationsOn: false,
    });

    const dismissSurvey = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setHideComponent(true);
            setSubmitted(true);
        }, 500);
    };

    const handleClick = async (score: number) => {
        await handleSubmit({ score });
        Cookies.set(cookieName, score.toString(), { expires: cookieLife });
        dismissSurvey();
    };

    const checkToShowSurvey = useCallback(() => {
        if (!Cookies.get(cookieName)) {
            setAnimateOut(false);
            setHideComponent(false);
        }
    }, []);

    const handleClose = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setHideComponent(true);
            setSubmitted(false);
        }, 500);

        setTimeout(() => {
            checkToShowSurvey();
        }, displayIn);
    };

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

    if (hideComponent || submitted) {
        return null;
    }

    return (
        <Box
            sx={{
                textAlign: "center",
                padding: 2,
                background: "white",
                position: "fixed",
                bottom: 0,
                left: `calc(50% - ${boxSize / 2}px)`,
                width: boxSize,
                zIndex: 999,
                animation: `${animateOut ? slideOut : slideIn} 0.5s ease-out`,
            }}>
            <IconButton
                sx={{ position: "absolute", top: 10, right: 10 }}
                onClick={handleClose}>
                <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
                {t("title")}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
                {ratings.map((obj, index) => {
                    const { icon: Icon, rating, colour } = obj;
                    return (
                        <Grid item key={rating.toString()}>
                            <Tooltip title={t(`tooltip-${index}`)}>
                                <IconButton onClick={() => handleClick(rating)}>
                                    <Icon
                                        aria-label={`Rating ${rating}`}
                                        sx={{
                                            cursor: "pointer",
                                            color: colour,
                                            minWidth: "75px",
                                            minHeight: "75px",
                                            margin: 1,
                                            fontSize: 1,
                                            fontWeight: "bold",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
