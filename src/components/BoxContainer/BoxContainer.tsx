import MuiBox, { BoxProps as MuiBoxProps } from "@mui/material/Box";

const BoxContainer = (props: MuiBoxProps) => {
    const { sx, ...rest } = props;
    return (
        <MuiBox
            sx={{
                gap: 1,
                display: "grid",
                ...sx,
            }}
            {...rest}
        />
    );
};

export default BoxContainer;
