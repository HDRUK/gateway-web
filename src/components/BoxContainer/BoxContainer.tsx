import MuiBox, { BoxProps as MuiBoxProps } from "@mui/material/Box";

/**
 * Documents:
 * https://mui.com/material-ui/react-box/
 */

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
