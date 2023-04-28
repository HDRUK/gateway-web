import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

interface LinkProps {
    href: string;
    label: string;
    variant?: "body2";
}

const Link = ({ href, label, variant = "body2" }: LinkProps) => {
    return (
        <MuiLink href={href} component={NextLink} variant={variant}>
            {label}
        </MuiLink>
    );
};

export default Link;
