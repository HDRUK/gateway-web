import { styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const StyledEditorWrapper = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "> div": {
        overflow: "scroll",
        height: "100px",
        border: "2px solid rgba(0, 0, 0, 0.23)",
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
        ":focus": {
            outline: `none`,
            borderColor: theme.palette.secondary.main,
        },
    },
}));

const StyledToolbar = styled("ul")(() => ({
    display: `flex`,
    backgroundColor: grey["300"],
    borderTopRightRadius: "4px",
    borderTopLeftRadius: "4px",
    padding: 0,
    margin: 0,
    listStyleType: "none",
    gap: "4px",
    "> li": {
        padding: "2px",
        position: "relative",
        "::after": {
            content: '""',
            border: `1px solid rgba(0,0,0,0.09)`,
            position: "absolute",
            right: "-2px",
            top: "8px",
            bottom: "8px",
        },
        ":last-child": {
            "::after": {
                border: "none",
            },
        },
    },
}));

export { StyledEditorWrapper, StyledToolbar };
