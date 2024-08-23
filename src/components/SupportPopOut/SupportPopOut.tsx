"use client";

import { useCallback, useEffect, useState } from "react";
import { Popover } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Link from "@/components/Link";
import {
    CUSTOMER_PORTAL_RAISE_SUPPORT_URL,
    CUSTOMER_PORTAL_REPORT_BUG_URL,
    CUSTOMER_PORTAL_SUPPORT_URL,
} from "@/config/hrefs";
import { RouteName } from "@/consts/routeName";
import { SupportButton, SupportList } from "./SupportPopOut.styles";

const SupportPopOut = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const t = useTranslations("components.SupportPopOut");

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            if (anchorEl) {
                setAnchorEl(null);
            } else {
                setAnchorEl(event.currentTarget);
            }
        },
        [anchorEl]
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
            href: `/${RouteName.SUPPORT}`,
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
            href: CUSTOMER_PORTAL_RAISE_SUPPORT_URL,
            isExternal: true,
        },
    ];

    const open = !!anchorEl;
    const id = open ? "support-popover" : undefined;
    return (
        <div>
            <SupportButton color="yellowCustom" onClick={handleClick}>
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
                            <li key={link.label}>
                                <Button
                                    component={Link}
                                    href={link.href}
                                    {...(link.isExternal && {
                                        target: "_blank",
                                        rel: "noreferrer",
                                    })}
                                    sx={{
                                        borderRadius: 0,
                                        boxShadow: "none",
                                    }}
                                    fullWidth
                                    color="yellowCustom">
                                    {link.label}
                                </Button>
                            </li>
                        ))}
                    </SupportList>
                </div>
            </Popover>
        </div>
    );
};

export default SupportPopOut;
