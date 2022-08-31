import { css } from '@emotion/react';
import { getComponentGlobals, getComponentStyle, getSize } from '../../configs/theme';

export const root = () => theme => {
    return css`
        word-break: break-word;
        width: 100%;
        position: relative;

        ${getComponentGlobals('Card', theme)};
    `;
};

export const cardHeader = () => theme =>
    css`
        border-bottom: 1px solid;
        padding: ${getSize(7, theme)};

        ${getComponentGlobals('CardHeader', theme)}
    `;

export const cardBody = () => theme =>
    css`
        padding: ${getSize(7, theme)};
    `;

export const cardFooter = () => theme =>
    css`
        padding: ${getSize(4, theme)};
        border-top: 1px solid;

        ${getComponentGlobals('CardFooter', theme)}
    `;
