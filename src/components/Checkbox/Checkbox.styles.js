import { css } from '@emotion/react';
import { getComponentGlobals, pickComponentVariantStyle, pickComponentVariantValue } from '../../configs/theme';

export const root =
    ({ variant, disabled, partial }) =>
    theme => {
        const {
            font,
            components: {
                Checkbox: { height, width },
            },
        } = theme;

        return css`
            ${mixins.root({ width, disabled })}

            font-size: ${font.size.default};

            &::before {
                ${mixins.before({ variant, width, height })(theme)}
                ${disabled && mixins.disabled({ variant })(theme)}
            }

            ${!disabled &&
            `&:hover {
				&::before {
					${pickComponentVariantStyle('Checkbox', variant, ':hover', theme)}
				}
			}`}

            input:disabled + span {
                ${getComponentGlobals('Input', 'label', { disabled }, theme)}
            }

            input + .ui-Checkbox__label::after {
                ${mixins.after({ width, height })}
            }

            input:disabled:not(:checked) + .ui-Checkbox__label::after {
                ${mixins.disabledNotChecked({ width, height })}
            }

            input:checked + .ui-Checkbox__label::after {
                ${!partial && mixins.checked({ variant })(theme)}
                ${partial && mixins.partial({ variant, width, height })(theme)}
            }
        `;
    };

export const mixins = {
    root: ({ width, disabled }) => `
		position: relative;
		padding-left: calc(${width} + 0.5rem);

		input {
			display: none;
		}

		${
            !disabled
                ? `&:hover {
			cursor: pointer;
			}`
                : ''
        }
	`,
    before:
        ({ variant, width, height }) =>
        theme =>
            `
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-width: 2px;
		border-style: solid;
		border-color: ${pickComponentVariantValue('Checkbox', variant, 'borderColor', theme)};
		width: ${width};
		height: ${height};
	`,
    after: ({ width, height }) => `
		content: '';
		position: absolute;
		top: 5px;
		left: 5px;
		width: calc(${width} - 10px);
		height: calc(${height} - 10px);
	`,
    disabledNotChecked: ({ width, height }) => `
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(${width} - 4px);
		height: calc(${height} - 4px);
	`,
    checked:
        ({ variant }) =>
        theme =>
            `
		background: ${pickComponentVariantValue('Checkbox', variant, 'checkedBackground', theme)};
		display: flex;
		align-items: center;
		justify-content: center;
	`,
    partial:
        ({ variant, width, height }) =>
        theme =>
            `
		border-top: 3px solid ${pickComponentVariantValue('Checkbox', variant, 'checkedBackground', theme)};
		z-index: 1;
		left: 5px;
		top: 9px;
		position: absolute;
		width: calc(${width} - 10px);
		height: calc(${height} - 10px);
		display: flex;
		align-items: center;
		justify-content: center;
	`,
    disabled:
        ({ variant }) =>
        theme =>
            `
		${pickComponentVariantStyle('Checkbox', variant, ':disabled', theme)};
	`,
};
