import { colors } from "@/config/colors";

export const galleryStyle = {
    figure: {
        maxWidth: "100%",
        overflow: "auto",
    },
    image: {
        height: "auto",
        width: "100%",
        background: "white",
        maxWidth: "100%",
        overflow: "auto",
    },
    iconButton: {
        position: "absolute",
        right: "-1em",
        top: "-1em",
    },
    closeIcon: { color: colors.white, fontSize: "2em" },
    arrow: {
        position: "absolute",
        top: "50%",
        width: "4em",
        height: "4em",
        zIndex: "3",
        filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
    },
    containerBox: {
        background: "rgb(0 0 0 / 85%)",
        zIndex: "9999",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
    },
    box: {
        position: "absolute",
        top: "50%",
        left: "50%",
        maxHeight: "100vh",
        transform: "translate(-50%, -50%)",
    },
};
