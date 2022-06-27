import { css } from '@emotion/react';
import { getColor, getComponentGlobals, getSize } from '../../configs/theme';

export const root = () => theme => {
    return css`
        word-break: break-word;
        width: 100%;
        position: relative;

        ${getComponentGlobals('Modal', theme)}
    `;
};

export const ModalHeader = () => theme =>
    css`
        border-bottom: 1px solid;
        padding: ${getSize(6, theme)};

        ${getComponentGlobals('ModalHeader', theme)}
    `;

export const ModalBody = () => theme =>
    css`
        padding: ${getSize(6, theme)};
    `;

export const ModalFooter = () => theme =>
    css`
        padding: ${getSize(4, theme)};
        border-top: 1px solid;

        ${getComponentGlobals('ModalFooter', theme)}
    `;
