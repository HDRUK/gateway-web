import MuiBox, { BoxProps as MuiBoxProps } from "@mui/material/Box";

const Box = (props: MuiBoxProps) => {
    const { sx, ...rest } = props;
    return (
        <MuiBox
            sx={{
                bgcolor: "white",
                p: 2,
                ...sx,
            }}
            {...rest}
        />
    );
};

export default Box;
