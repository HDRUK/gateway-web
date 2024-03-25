"use client";

import { useState } from "react";
import { Popover } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import { CUSTOMER_PORTAL_SUPPORT_URL } from "@/config/hrefs";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { SupportButton, SupportList } from "./SupportPopOut.styles";

const SupportPopOut = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const t = useTranslations("components.SupportPopOut");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "support-popover" : undefined;
    return (
        <div>
            <SupportButton endIcon={<SpeechBubbleIcon />} onClick={handleClick}>
                {t("buttonText")}
            </SupportButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "right",
                }}>
                <Paper>
                    <SupportList>
                        <li>
                            <Link
                                target="_blank"
                                rel="noreferrer"
                                href={CUSTOMER_PORTAL_SUPPORT_URL}>
                                {t("giveFeedback")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                target="_blank"
                                rel="noreferrer"
                                href={CUSTOMER_PORTAL_SUPPORT_URL}>
                                {t("reportBug")}
                            </Link>
                        </li>
                        <li>
                            <Link href="/about/contact-us">
                                {t("needSupport")}
                            </Link>
                        </li>
                    </SupportList>
                </Paper>
            </Popover>
        </div>
    );
};

export default SupportPopOut;
