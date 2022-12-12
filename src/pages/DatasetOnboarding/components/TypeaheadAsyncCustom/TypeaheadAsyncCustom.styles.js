import { css } from '@emotion/react';

export const root = icon => theme => {
    const { colors } = theme;

    return css`
        .menu {
            font-size: 14px;
            font-family: 'museo-sans-rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .location {
            float: left;
        }
        .hierarchy {
            float: right;
            color: ${colors.grey700Alt};
        }
    `;
};
