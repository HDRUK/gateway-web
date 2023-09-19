import type { Meta } from "@storybook/react";
import { BoxProps } from "@mui/material/Box";
import Box from "./Box";

/**
 * Documents:
 * https://mui.com/material-ui/react-box/
 */

const meta: Meta<typeof Box> = {
    component: Box,
    title: "Layout/Box",
};

export default meta;

export const Default = (args: BoxProps) => <Box {...args} />;

Default.args = {
    children: "This is a box",
};
