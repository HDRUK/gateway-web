/** @jsxImportSource @emotion/react */

import { Stack, Typography } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";

export interface toggleButtonProps extends SwitchProps {
    checkedLabel: string;
    unCheckedLabel: string;
}

const ToggleButton = ({
    checkedLabel,
    unCheckedLabel,
    ...rest
}: toggleButtonProps) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{unCheckedLabel}</Typography>
            <Switch role="switch" disableRipple {...rest} />
            <Typography>{checkedLabel}</Typography>
        </Stack>
    );
};

export default ToggleButton;
