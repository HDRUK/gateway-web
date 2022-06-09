import { css } from '@emotion/react';
import { getComponentSize, getComponentVariant } from '../../configs/theme';

export const mixins = {
    button: () =>
        `
        border-width: 2px;
        border-style: solid;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        .ui-Icon,
        svg {
            height: 1em;
            width: 1em;
        }
`,
};

export const root =
    ({ variant, size }) =>
    theme => {
        const {
            base: { unit, increment },
        } = theme;

        return css`
            ${mixins.button()}
            ${getComponentVariant('Button', variant, theme)}
            ${getComponentSize('Button', size, theme)}

            border-radius: 4px;
            gap: ${increment * 1.5}${unit};
        `;
    };
