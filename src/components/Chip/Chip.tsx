import { cloneElement } from "react";
import MuiChip, { ChipProps as MuiChipProps } from "@mui/material/Chip";
import { ResourceType } from "@/interfaces/AddResource";
import { colors } from "@/config/theme";
import {
    DataUseIcon,
    DatasetIcon,
    PublicationIcon,
    ToolIcon,
} from "@/consts/customIcons";

export interface ChipProps extends MuiChipProps {
    label: string;
    resourceType?: ResourceType;
}

const resourceChipConfig = {
    [ResourceType.DATASET]: {
        icon: <DatasetIcon sx={{ "*": { fill: "white" } }} />,
        sx: { color: "white", backgroundColor: "secondary.main" },
    },
    [ResourceType.PUBLICATION]: {
        icon: <PublicationIcon />,
        sx: { backgroundColor: colors.darkGreen100 },
    },
    [ResourceType.DATA_USE]: {
        icon: <DataUseIcon />,
        sx: { backgroundColor: colors.orange300 },
    },
    [ResourceType.TOOL]: {
        icon: <ToolIcon sx={{ "*": { fill: "white" } }} />,
        sx: { color: "white", backgroundColor: colors.purple900 },
    },
};

const Chip = ({ label, resourceType, ...rest }: ChipProps) => {
    if (resourceType) {
        const config = resourceChipConfig[resourceType];

        return (
            <MuiChip
                label={label}
                {...rest}
                icon={cloneElement(config.icon, {
                    sx: {
                        "&.MuiChip-icon.MuiSvgIcon-root": {
                            fontSize: 12,
                            ml: 1,
                            ...config.icon.props.sx,
                        },
                    },
                })}
                size="small"
                sx={{
                    "& .MuiChip-label": {
                        overflow: "visible",
                    },
                    ...config.sx,
                }}
            />
        );
    }

    return <MuiChip label={label} {...rest} />;
};

export default Chip;
