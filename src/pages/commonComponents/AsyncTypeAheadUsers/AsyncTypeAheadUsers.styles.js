import { css } from '@emotion/react';

export const root = icon => theme => {
    const { colors } = theme;

    return css`
        .header {
            border-top: none;
            font-weight: bold;
            font-size: 16px;
        }
        .name {
            float: left;
        }
        .icon {
            float: right;
        }
    `;
};
