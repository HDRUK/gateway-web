import { css } from '@emotion/react';
import { getComponentSize, getComponentVariant, getSize } from '../../configs/theme';

export const mixins = {
    button: () =>
        `
        border-width: 2px;
        border-style: solid;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1em;
`,
};

export const root =
    ({ variant, size }) =>
    theme => {
        return css`
            ${mixins.button()}
            ${getComponentVariant('Button', variant, theme)}
            ${getComponentSize('Button', size, theme)}

            border-radius: 4px;
            gap: ${getSize(1, theme)};
        `;
    };
