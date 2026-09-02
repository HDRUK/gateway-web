"use client";

import { Fragment } from "react";
import { tokens } from "@hdruk/ui/theme";
import { ListItemButton } from "@mui/material";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { CloseIcon, CheckIcon, PriorityHighIcon } from "@/consts/icons";
import { capitalise, splitCamelcase } from "@/utils/general";
import Box from "../Box";
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
            return tokens.brand.secondary;
        case LegendStatus.ACTIVE:
            return tokens.brand.primary;
        case LegendStatus.OPTIONAL_REMAIN:
            return "#F0BB24";
        case LegendStatus.INVALID:
            return tokens.status.error;
        default:
            return tokens.brand.accentPrimary;
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
            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <Fragment key={item.name}>
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
                            {Icon ? (
                                <Icon
                                    sx={{
                                        mr: 1.25,
                                        width: "18px",
                                        height: "18px",
                                        color:
                                            item.status === LegendStatus.ACTIVE
                                                ? tokens.brand.primary
                                                : tokens.text.faded,
                                    }}
                                />
                            ) : (
                                <LegendIcon
                                    iconColour={getBackgroundColour(
                                        item.status
                                    )}>
                                    {getIcon(item.status)}
                                </LegendIcon>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    p: 0,
                                    width: "100%",
                                    gap: 3,
                                }}>
                                <Typography
                                    sx={{
                                        fontWeight:
                                            item.status === LegendStatus.ACTIVE
                                                ? 600
                                                : "normal",
                                    }}>
                                    {capitalise(splitCamelcase(item.name))}
                                </Typography>

                                {item.count !== undefined && (
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                item.status ===
                                                LegendStatus.ACTIVE
                                                    ? 600
                                                    : "normal",
                                        }}>
                                        ({item.count})
                                    </Typography>
                                )}
                            </Box>
                        </ListItemButton>
                        {item.subItems && (
                            <FormLegend
                                items={item.subItems}
                                level={level + 1}
                                handleClickItem={handleClickItem}
                            />
                        )}
                    </Fragment>
                );
            })}
        </Wrapper>
    );
};

export default FormLegend;
