"use client";

import { Typography } from "@mui/material";
import Button from "@/components/Button";
import theme from "@/config/theme";
import {
    StyledNewsletterSignup,
    StyledNewsletterSignupBackground,
    StyledNewsletterSignupCta,
} from "./NewsletterSignup.styles";

export default function NewsletterSignup() {
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
                    Sign up for the monthly Gateway Newsletter
                </Typography>
                <Typography
                    sx={{
                        mb: 2,
                        fontSize: "1rem",
                        [theme.breakpoints.up(810)]: {
                            fontSize: "20px",
                        },
                    }}>
                    Be the first to know about all the latest Gateway updates
                    and events.
                </Typography>
                <Button
                    sx={{
                        [theme.breakpoints.up(810)]: {
                            height: "60px",
                            minWidth: "100px",
                        },
                    }}>
                    <Typography fontSize="20px">Join</Typography>
                </Button>
            </StyledNewsletterSignupCta>
        </StyledNewsletterSignup>
    );
}
