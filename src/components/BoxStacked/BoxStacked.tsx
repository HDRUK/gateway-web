"use client";

import { HTMLAttributes } from "react";
import { Box, BoxProps, css, styled } from "@mui/material";

export type BoxStackedProps = HTMLAttributes<HTMLDivElement> & BoxProps;

const StyledBoxStacked = styled(Box)(
    ({ theme }) => css`
        padding-right: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
        position: relative;
        display: flex;

        > * {
            position: relative;
            z-index: 1;
            flex-grow: 1;
        }

        :before,
        :after {
            content: "";
            position: absolute;
            top: 0;
        }

        :before {
            bottom: 0;
            right: 0;
            background: ${theme.palette.grey[400]};
            left: ${theme.spacing(2)};
        }

        :after {
            bottom: ${theme.spacing(1)};
            right: ${theme.spacing(1)};
            background: ${theme.palette.grey[200]};
            left: ${theme.spacing(1)};
        }
    `
);

const BoxStacked = ({ children, ...restProps }: BoxStackedProps) => {
    return <StyledBoxStacked {...restProps}>{children}</StyledBoxStacked>;
};

export default BoxStacked;
