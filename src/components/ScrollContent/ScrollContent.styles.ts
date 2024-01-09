import { css } from "@emotion/react";

export const root = css`
    padding: 10px;
    overflow: scroll;

    /* Set the width and height of the scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    /* Set the background color of the scrollbar */
    ::-webkit-scrollbar-track {
        background-color: #f1f1f1;
    }

    /* Set the color of the scrollbar thumb */
    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }

    /* Keep the scrollbar always visible */
    ::-webkit-scrollbar-thumb:vertical {
        min-height: 50px;
    }
`;
