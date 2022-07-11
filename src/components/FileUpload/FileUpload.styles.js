import { css } from '@emotion/react';
import { getColorStyle, getSpacingStyle } from '../../configs/theme';

export const table = theme => {
    return css`
        width: 100%;

        th,
        td {
            ${getSpacingStyle('padding', 2, theme)};
            vertical-align: middle;
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
