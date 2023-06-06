import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

// eslint-disable-next-line @typescript-eslint/ban-types
type IconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
};

export type { IconType };
