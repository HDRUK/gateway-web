"use client";

import { ReactNode } from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import Button from "@/components/Button";
import theme from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import {
    StyledNewsletterSignup,
    StyledNewsletterSignupBackground,
    StyledNewsletterSignupCta,
} from "./NewsletterSignup.styles";

interface NewsletterSignupProps {
    title: ReactNode;
    description: ReactNode;
}

export default function NewsletterSignup({
    title,
    description,
}: NewsletterSignupProps) {
    return (
        <StyledNewsletterSignup>
            <StyledNewsletterSignupBackground />
            <StyledNewsletterSignupCta>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: "1.75rem",
                        [theme.breakpoints.up(810)]: {
                            fontSize: "40px",
                        },
                    }}>
                    {title}
                </Typography>
                <Typography
                    sx={{
                        mb: 2,
                        fontSize: "1rem",
                        [theme.breakpoints.up(810)]: {
                            fontSize: "20px",
                        },
                    }}>
                    {description}
                </Typography>
                <Button
                    component={Link}
                    href={RouteName.NEWSLETTER_SIGNUP}
                    sx={{
                        color: "#fff",
                        [theme.breakpoints.up(810)]: {
                            height: "60px",
                            minWidth: "149px",
                        },
                        fontSize: "20px",
                    }}
                    title="Sign up for newsletter">
                    Join
                </Button>
            </StyledNewsletterSignupCta>
        </StyledNewsletterSignup>
    );
}
