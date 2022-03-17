import { css } from '@emotion/react';

export const root = css`
    display: flex;
    align-items: center;
`;

export const dropdown = css`
    width: 100%;
`;

export const button = css`
    & > span {
        display: flex;
        align-items: center;
    }
`;
