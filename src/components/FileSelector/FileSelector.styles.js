import { css } from '@emotion/react';
import { getColorStyle, getSpacingStyle } from '../../configs/theme';

export const root = () => css`
    input {
        visibility: hidden;
        position: absolute;
        z-index: 0;
    }
`;

export const table = theme => {
    return css`
        width: 100%;

        th,
        td {
            ${getSpacingStyle('padding', 3, theme)};
            vertical-align: middle;
        }

        tr td:last-child {
            padding-right: 0;
        }

        thead tr {
            border-top: 1px solid;
            border-bottom: 1px solid;
            ${getColorStyle('border-color', 'grey300', theme)}
        }

        tbody tr {
            border-bottom: 1px solid;
            ${getColorStyle('border-color', 'grey300', theme)}
        }
    `;
};

export const nameColumn = () => css`
    width: 100px;
    white-space: nowrap;
`;

export const actionsColumn = () => css`
    width: 1px;
    white-space: nowrap;
`;
