import {
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonProps,
} from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import Paper from "@/components/Paper";
import Typography from "../Typography";

interface ButtonsProps extends ToggleButtonProps {
    icon: IconType;
    label: string;
}

interface ToggleTabsProps {
    buttons: ButtonsProps[];
    selected: string;
}

const ToggleTabs = ({ buttons, selected }: ToggleTabsProps) => {
    return (
        <Paper>
            <ToggleButtonGroup value={selected}>
                {buttons.map(({ icon: Icon, value, label, ...rest }) => {
                    return (
                        <ToggleButton
                            key={label}
                            value={value}
                            {...rest}
                            disableRipple>
                            <Icon sx={{ fill: "black" }} />
                            <Typography
                                color="grey"
                                sx={{ ml: "3px", textTransform: "capitalize" }}>
                                {label}
                            </Typography>
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </Paper>
    );
};

export default ToggleTabs;
