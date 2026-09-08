import { tokens } from "@hdruk/ui/theme";
import { css } from "@emotion/react";

export const table = css({
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    tableLayout: "fixed",
});

export const th = css({
    padding: 10,
    borderBottom: `1px solid ${tokens.status.grey}`,
    borderRight: `1px solid ${tokens.status.grey}`,
    ":last-child": {
        borderRight: 0,
    },
});

export const td = css({
    padding: "5px 10px",
    borderBottom: `1px solid ${tokens.status.grey}`,
    borderRight: `1px solid ${tokens.status.grey}`,
    ":last-child": {
        borderRight: 0,
    },
});
