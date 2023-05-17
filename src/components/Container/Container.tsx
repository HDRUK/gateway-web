import MuiContainer, {
    ContainerProps as MuiContainerProps,
} from "@mui/material/Container";

const Container = (props: MuiContainerProps) => {
    const { maxWidth = "desktop", ...rest } = props;
    return (
        <MuiContainer
            maxWidth={maxWidth}
            {...rest}
            style={{ backgroundColor: "white" }}
        />
    );
};

export default Container;
