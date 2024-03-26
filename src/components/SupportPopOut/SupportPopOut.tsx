"use client";

import { useCallback, useEffect, useState } from "react";
import { Popover } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "@/components/Link";
import {
    CUSTOMER_PORTAL_REPORT_BUG_URL,
    CUSTOMER_PORTAL_SUPPORT_URL,
} from "@/config/hrefs";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import Button from "../Button";
import { SupportButton, SupportList } from "./SupportPopOut.styles";

const SupportPopOut = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const t = useTranslations("components.SupportPopOut");

    const handleClick = useCallback(
        () => (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        },
        []
    );

    const handleClose = () => {
        setAnchorEl(null);
    };

    const pathname = usePathname();

    useEffect(() => {
        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const links = [
        {
            label: t("visitSupportCentre"),
            href: "/about/contact-us",
            isExternal: false,
        },
        {
            label: t("giveFeedback"),
            href: CUSTOMER_PORTAL_SUPPORT_URL,
            isExternal: true,
        },
        {
            label: t("reportBug"),
            href: CUSTOMER_PORTAL_REPORT_BUG_URL,
            isExternal: true,
        },
        {
            label: t("requestSupport"),
            href: CUSTOMER_PORTAL_SUPPORT_URL,
            isExternal: true,
        },
    ];

    const open = !!anchorEl;
    const id = open ? "support-popover" : undefined;
    return (
        <div>
            <SupportButton
                color="yellowCustom"
                endIcon={<SpeechBubbleIcon />}
                onClick={handleClick}>
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
                transformOrigin={{ vertical: "center", horizontal: 180 }}>
                <div>
                    <SupportList>
                        {links.map(link => (
                            <li>
                                <Link
                                    passHref
                                    href={link.href}
                                    {...(link.isExternal && {
                                        target: "_blank",
                                        rel: "noreferrer",
                                    })}>
                                    <Button
                                        sx={{
                                            borderRadius: 0,
                                            boxShadow: "none",
                                        }}
                                        fullWidth
                                        color="yellowCustom">
                                        {link.label}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </SupportList>
                </div>
            </Popover>
        </div>
    );
};

export default SupportPopOut;
