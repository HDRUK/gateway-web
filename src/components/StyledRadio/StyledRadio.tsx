import { Radio } from "@mui/material";
import { RadioProps } from "@mui/material/Radio";
import { green, grey } from "@mui/material/colors";

const StyledRadio = ({ size, ...rest }: RadioProps) => {
    return (
        <Radio
            sx={{
                color: grey[400],
                padding: "7px 9px",

                "& .MuiSvgIcon-root": {
                    fontSize: 30,
                    ml: 0.5,
                    mr: 0.5,
                },

                "&.Mui-checked": {
                    color: grey[400],

                    "svg:last-of-type": {
                        color: green[700],
                    },
                },
            }}
            disableRipple
            size={size}
            {...rest}
        />
    );
};

export default StyledRadio;
