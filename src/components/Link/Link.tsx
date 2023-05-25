import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import { TypographyProps } from "@mui/material";
import { ReactNode } from "react";

interface LinkProps extends TypographyProps {
    href: string;
    label: ReactNode;
}

const Link = ({ href, label, variant, ...props }: LinkProps) => {
    return (
        <MuiLink href={href} component={NextLink} variant={variant} {...props}>
            {label}
        </MuiLink>
    );
};

export default Link;
