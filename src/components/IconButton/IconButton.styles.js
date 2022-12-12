import { css } from '@emotion/react';
import { getComponentSize, getComponentVariant } from '../../configs/theme';
import { mixins } from '../Button/Button.styles';

export const root =
    ({ variant, size }) =>
    theme => {
        return css`
            ${mixins.button()}
            ${getComponentVariant('IconButton', variant, theme)}
            ${getComponentSize('IconButton', size, theme)}

            border-radius: 50%;
        `;
    };
