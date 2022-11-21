import { css } from '@emotion/react';

export const root = () => theme => {
    const { colors } = theme;

    return css`
        color: ${colors.purple500};
        &:hover {
            color: ${colors.purple500};
        }
    `;
};
