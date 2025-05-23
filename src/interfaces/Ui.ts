import { ReactNode } from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

// eslint-disable-next-line @typescript-eslint/ban-types
type IconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
};

interface LeftNavItem {
    icon: ReactNode;
    label: string;
    href?: string;
    subItems?: { label: string; href: string }[];
}

export type { IconType, LeftNavItem };
