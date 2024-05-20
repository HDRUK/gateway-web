"use client";

import { useEffect } from "react";
import { Box } from "@mui/material";
import { HUBSPOT_FORM_CREATE } from "@/config/forms/hubspot";

export default function SignupNewsletter() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//js.hsforms.net/forms/embed/v2.js";
        document.body.appendChild(script);

        script.addEventListener("load", () => {
            if (window.hbspt) {
                window.hbspt.forms.create({
                    ...HUBSPOT_FORM_CREATE,
                    formId: "224019f7-2d09-4bfa-885b-12cd7822c292",
                    target: "#newsletterSignupForm",
                });
            }
        });
    }, []);

    return (
        <Box sx={{ m: "0 auto", py: 5, maxWidth: "900px" }}>
            <div id="newsletterSignupForm" />
        </Box>
    );
}
