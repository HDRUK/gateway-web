"use client";

import { useEffect, useState, useCallback } from "react";
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

interface Ratings {
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
    rating: number;
    colour: string;
}

const COOKIE_NAME = "recommendationSubmitted";

const ratings: Ratings[] = [
    {
        icon: MoodBadIcon,
        rating: 1,
        colour: "#dc3645",
    },
    {
        icon: SentimentVeryDissatisfiedIcon,
        rating: 2,
        colour: "#fe7e00",
    },
    {
        icon: SentimentSatisfiedIcon,
        rating: 3,
        colour: "#f0bb24",
    },
    {
        icon: SentimentSatisfiedAltIcon,
        rating: 4,
        colour: "#addad9",
    },
    {
        icon: InsertEmoticonIcon,
        rating: 5,
        colour: "#3cb28c",
    },
];

const CustomerSurvey = ({ hideOnLoad = true }) => {
    const t = useTranslations("components.CustomerSurvey");
    const pathname = usePathname();
    const [hideComponent, setHideComponent] = useState(hideOnLoad);
    const [submitted, setSubmitted] = useState(false);
    const displayIn = 5000;
    const boxSize = 600;
    const slideIn = keyframes`
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    `;

    const handleSubmit = usePost(apis.customerSatisfactionV1Url, {
        successNotificationsOn: false,
    });

    const handleClick = async (score: number) => {
        await handleSubmit({ score });
        Cookies.set(COOKIE_NAME, score.toString(), { expires: 30 });
        setHideComponent(true);
        setSubmitted(true);
    };

    const checkToHide = useCallback(() => {
        if (!Cookies.get(COOKIE_NAME)) {
            setHideComponent(false);
        }
    }, []);

    // Reset on page change
    useEffect(() => {
        setHideComponent(hideOnLoad);
        setSubmitted(false);
    }, [pathname, hideOnLoad]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (hideComponent) {
            intervalId = setInterval(checkToHide, displayIn);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [hideComponent, checkToHide]);

    if (hideComponent || submitted) {
        return null;
    }

    return (
        <Box
            sx={{
                textAlign: "center",
                padding: "20px",
                background: "white",
                position: "fixed",
                bottom: 0,
                left: `calc(50% - ${boxSize / 2}px)`,
                width: boxSize,
                zIndex: 999,
                animation: `${slideIn} 0.5s ease-out`,
            }}>
            <Typography variant="h6" gutterBottom>
                {t("title")}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
                {ratings.map((obj, index) => {
                    const { icon:Icon, rating, colour } = obj;
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
                                            margin: "5px",
                                            fontSize: "16px",
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
};

export default CustomerSurvey;
