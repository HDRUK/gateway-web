import NextLink from "next/link";
import MuiLink from "@mui/material/Link";
import { LinkProps } from "@mui/material";

interface LinkProp extends LinkProps {
    href: string;
    // eslint-disable-next-line react/require-default-props
    label?: string;
}

const Link = ({ href, label, children, variant, ...rest }: LinkProp) => {
    return (
        <MuiLink {...rest} href={href} component={NextLink} variant={variant}>
            {label || children}
        </MuiLink>
    );
};

export default Link;
