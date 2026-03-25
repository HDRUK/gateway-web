"use client";

import { forwardRef } from "react";
import { LinkProps as MuiLinkProps } from "@mui/material";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";

interface LinkProps extends MuiLinkProps {
    href: string;
    passHref?: boolean;
    prefetch?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ href, passHref = false, children, variant, ...props }, ref) => {
        const isExternal = href.startsWith?.("http");

        return (
            <MuiLink
                ref={ref}
                href={href}
                component={NextLink}
                passHref={passHref}
                {...(variant && { variant })}
                {...props}
                {...(isExternal && { target: "_blank", rel: "noopener" })}>
                {children}
            </MuiLink>
        );
    }
);

export default Link;
