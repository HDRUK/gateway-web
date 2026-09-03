import { tokens } from "@hdruk/ui/theme";
import { css } from "@emotion/react";

export const dot = css({
    position: "absolute",
    width: "8px",
    height: "8px",
    right: "12px",
    top: "13px",
    borderRadius: "4px",
    backgroundColor: tokens.status.needsAction,
});
