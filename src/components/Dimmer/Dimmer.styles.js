import { css } from '@emotion/react';
import { getComponentGlobals } from '../../configs/theme';

export const root = () => theme => {
    return css`
        overflow: visible;
        opacity: 1;
        width: 100%;
        height: 100%;
        z-index: 9999;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        ${getComponentGlobals('Dimmer', theme)}
    `;
};
