import { css } from '@emotion/react';
import { checkboxMixins } from 'configs/theme';

export const root =
    ({ variant, disabled, partial }) =>
    theme => {
        const {
            colors,
            components: {
                Checkbox: { height, width, variants, fontSize, disabledColor },
            },
        } = theme;

        return css`
            ${checkboxMixins.root({ width, disabled })}

            font-size: ${fontSize};
            display: block;

            &::before {
                ${checkboxMixins.before({ colors, variants, variant, width, height })}
            }

            input:disabled + span {
                color: ${colors[disabledColor]};
            }

            input + .ui-Checkbox__label::after {
                ${checkboxMixins.after({ width, height })}
            }

            input:disabled:not(:checked) + .ui-Checkbox__label::after {
                ${checkboxMixins.disabledNotChecked({ width, height })}
            }

            input:checked + .ui-Checkbox__label::after {
                ${checkboxMixins.checked({ colors, variants, variant })}
            }

            input:checked + .ui-Checkbox__label::after {
                ${checkboxMixins.checked({ colors, variants, variant })}
            }

            input + .ui-Checkbox__label > span::after {
                ${partial && checkboxMixins.partial({ width, height })}
            }

            input:disabled + .ui-Checkbox__label::after {
                ${checkboxMixins.disabled({ colors, variants, variant, disabledColor })}
            }
        `;
    };
