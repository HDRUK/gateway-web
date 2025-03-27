import { LinkProps as MuiLinkProps } from "@mui/material";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";

interface LinkProps extends MuiLinkProps {
    href: string;
    passHref?: boolean;
    prefetch?: boolean;
}

const Link = ({
    href,
    passHref = false,
    children,
    variant,
    ...props
}: LinkProps) => {
    const isExternal = href.startsWith("http");

    return (
        <MuiLink
            href={href}
            passHref={passHref}
            component={NextLink}
            {...(variant && { variant })}
            {...props}
            {...(isExternal && { target: "_blank", rel: "noopener" })}>
            {children}
        </MuiLink>
    );
};

export default Link;
