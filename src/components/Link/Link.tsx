import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import { LinkProps as MuiLinkProps } from "@mui/material";

interface LinkProps extends MuiLinkProps {
    href: string;
    passHref?: boolean;
}

const Link = ({
    href,
    passHref = false,
    children,
    variant,
    ...props
}: LinkProps) => {
    return (
        <MuiLink
            href={href}
            passHref={passHref}
            component={NextLink}
            variant={variant}
            {...props}>
            {children}
        </MuiLink>
    );
};

export default Link;
