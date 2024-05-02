"use client";

import { ReactNode } from "react";
import { Typography } from "@mui/material";
import Button from "@/components/Button";
import Link from "@/components/Link";
import theme from "@/config/theme";
import {
    StyledNewsletterSignup,
    StyledNewsletterSignupBackground,
    StyledNewsletterSignupCta,
} from "./NewsletterSignup.styles";

interface NewsletterSignupProps {
    title: ReactNode;
    description: ReactNode;
    link: {
        url: string;
        title: string;
    };
}

export default function NewsletterSignup({
    title,
    description,
    link,
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
                <Link
                    component={Button}
                    href={link.url}
                    title={link.title}
                    target="_blank"
                    sx={{
                        color: "#fff",
                        [theme.breakpoints.up(810)]: {
                            height: "60px",
                            minWidth: "149px",
                        },
                    }}>
                    <Typography fontSize="20px">Join</Typography>
                </Link>
            </StyledNewsletterSignupCta>
        </StyledNewsletterSignup>
    );
}
