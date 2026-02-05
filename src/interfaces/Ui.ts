import { ReactNode } from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type IconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
};

interface LeftNavItem {
    icon: ReactNode;
    label: string;
    href?: string;
    subItems?: {
        label: string;
        href: string;
        onClick?: (href: string) => Promise<string>;
    }[];
}

export type { IconType, LeftNavItem };
