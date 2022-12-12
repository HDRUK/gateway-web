import { css } from '@emotion/react';

export const root = css`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

export const listItem = css`
    display: flex;
    margin-bottom: 4px;

    &:last-child {
        margin: 0;
    }
`;

export const col1 = widthCol1 => theme =>
    css`
        color: ${theme.colors.grey700Alt};
        min-width: ${widthCol1};
        max-width: ${widthCol1};
        margin-right: 32px;
    `;
