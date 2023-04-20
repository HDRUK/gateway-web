import { css } from '@emotion/react';

export const root = () => theme =>
    css`
        background: white;
        padding: 10px 10px 10px 30px;
        max-width: 395px;
        box-shadow: 0px 0px 4px ${theme.colors.green700};
    `;
