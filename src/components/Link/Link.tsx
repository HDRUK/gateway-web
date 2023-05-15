import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import { TypographyProps } from "@mui/material";

interface LinkProps extends TypographyProps {
    href: string;
    label: string;
}

const Link = ({ href, label, variant }: LinkProps) => {
    return (
        <MuiLink href={href} component={NextLink} variant={variant}>
            {label}
        </MuiLink>
    );
};

export default Link;
