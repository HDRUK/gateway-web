"use client";

import { ListItemButton } from "@mui/material";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { colors } from "@/config/theme";
import { CloseIcon, CheckIcon, PriorityHighIcon } from "@/consts/icons";
import { capitalise, splitCamelcase } from "@/utils/general";
import Typography from "../Typography";
import { Wrapper, LegendIcon } from "./FormLegend.styles";

interface FormLegendProps {
    items: LegendItem[];
    offsetTop?: string;
    level?: number;
    removeMarginLeft?: boolean;
    handleClickItem?: (itemIndex: number) => void;
}

const getIcon = (status: LegendStatus) => {
    switch (status) {
        case LegendStatus.VALID:
            return <CheckIcon />;
        case LegendStatus.OPTIONAL_REMAIN:
            return <PriorityHighIcon />;
        case LegendStatus.INVALID:
            return <CloseIcon />;
        default:
            return null;
    }
};

const getBackgroundColour = (status: LegendStatus) => {
    switch (status) {
        case LegendStatus.VALID:
            return colors.green400;
        case LegendStatus.ACTIVE:
            return colors.purple500;
        case LegendStatus.OPTIONAL_REMAIN:
            return "#F0BB24";
        case LegendStatus.INVALID:
            return colors.red700;
        default:
            return colors.purple100;
    }
};

const FormLegend = ({
    items,
    offsetTop,
    level = 1,
    removeMarginLeft,
    handleClickItem,
}: FormLegendProps) => {
    return (
        <Wrapper
            offsetTop={offsetTop || "initial"}
            sx={{ justifyContent: "center" }}>
            {items.map((item, index) => (
                <>
                    <ListItemButton
                        sx={{
                            marginLeft: removeMarginLeft
                                ? 0
                                : `${level * 16}px`,
                        }}
                        key={`${item.name}`}
                        onClick={() =>
                            handleClickItem &&
                            (item.id
                                ? handleClickItem(item.id)
                                : handleClickItem(index))
                        }>
                        <LegendIcon
                            iconColour={getBackgroundColour(item.status)}>
                            {getIcon(item.status)}
                        </LegendIcon>
                        <Typography>
                            {capitalise(splitCamelcase(item.name))}
                        </Typography>
                    </ListItemButton>
                    {item.subItems && (
                        <FormLegend
                            items={item.subItems}
                            level={level + 1}
                            handleClickItem={handleClickItem}
                        />
                    )}
                </>
            ))}
        </Wrapper>
    );
};

export default FormLegend;
