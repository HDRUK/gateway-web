import { css } from '@emotion/react';
import { getSpacingStyle } from '../../configs/theme';

export const mixins = {
    input:
        ({ variant, error }) =>
        config => {
            const { colors, variants } = config;

            return css`
                background: ${colors[variants[variant].background]};
                border-style: solid !important;
                border-width: 2px !important;
                border-color: ${error ? colors.red600 : colors[variants[variant].borderColor]} !important;
                border-radius: 0.25rem !important;

                &:focus,
                &.focus,
                &:focus-within,
                &:focus-visible {
                    border-color: ${colors.teal} !important;
                    outline: none;
                }
            `;
        },
    label: theme => css`
        ${getSpacingStyle('margin-bottom', 2, theme)}
    `,
    formGroup: ({
        font: {
            size: { default: fontSize },
        },
    }) => css`
        font-size: ${fontSize};
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
    `,
};

export const inputGroup =
    ({ prepend, append, variant, size, error }) =>
    theme => {
        const {
            colors,
            font: {
                size: { default: defaultSize },
            },
            components: {
                Input: { sizes, variants },
            },
        } = theme;

        return css`
            width: 100%;

            input.form-control,
            .rbt-input.form-control {
                ${prepend.offsetWidth ? `padding-left: calc(${prepend.offsetWidth}px + 1.2em);` : ''}
                ${append.offsetWidth ? `padding-right: calc(${append.offsetWidth}px + 1.2em);` : ''}
			font-size: ${defaultSize};
                height: ${sizes[size].height};
                width: 100%;

                ${mixins.input({ variant, error })({ colors, variants })}
            }
        `;
    };

export const prepend = css`
    left: 1em;
`;

export const append = css`
    right: 1em;
`;

export const decorators = css`
    position: absolute;
    z-index: 4;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
`;

export const { formGroup } = mixins;

export const { label } = mixins;
