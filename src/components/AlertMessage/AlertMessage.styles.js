import { css } from '@emotion/react';
import { getComponentGlobalStyles, getComponentVariant, getSize } from '../../configs/theme';

export const root =
    ({ variant }) =>
    theme =>
        css`
            display: flex;
            align-items: flex-start;

            ${getComponentGlobalStyles('AlertMessage', theme)}
            ${getComponentVariant('AlertMessage', variant, theme)}
        `;

export const icon = () => theme =>
    css`
        margin-right: ${getSize(2, theme)};
        margin-top: 1px;
    `;
