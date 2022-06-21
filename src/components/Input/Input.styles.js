import { css } from '@emotion/react';
import { getGlobals, getComponentStylesFromTheme, getSpacingStyle } from '../../configs/theme';

export const mixins = {
    input:
        ({ variant, error }) =>
        config => {
            const { colors, variants } = config;

            return css`
                border-style: solid !important;
                border-width: 2px !important;
                border-radius: 0.25rem !important;

                ${getComponentStylesFromTheme(variants[variant], config, true)};

                ${error &&
                `
                    border-color: ${colors.red600} !important;

                    &:hover,
                    &:focus,
                    &.focus,
                    &:focus-within,
                    &:focus-visible {
                        border-color: ${colors.red600} !important;
                        outline: none;
                    }
                `}
            `;
        },
    label:
        ({ component, disabled }) =>
        theme =>
            css`
                ${getSpacingStyle('margin-bottom', 1, theme)}
                ${getGlobals(component, 'label', { disabled }, theme)}
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
