import { css } from '@emotion/react';
import { getColorStyle, getComponentGlobals, getFontSizeStyle } from '../../configs/theme';

export const root =
    ({ disabled }) =>
    theme => {
        const { width, height, checkedBackground, background, disabledBackground, disabledColor, fontSize } = getComponentGlobals(
            'Switch',
            theme
        );
        const { background: controlBackground } = getComponentGlobals('SwitchControl', theme);

        return css`
            position: relative;
            cursor: pointer;
            min-height: ${height};
            ${getFontSizeStyle(fontSize, theme)}

            input {
                display: none;
            }

            ${disabled && getColorStyle('color', disabledColor, theme)}

            .ui-SwitchControl {
                padding-left: 50px;
                ${getColorStyle('background', controlBackground, theme)}

                span {
                    padding-top: 4px;
                }
            }

            input + .ui-SwitchControl::before {
                ${getColorStyle('background', background, theme)};
                width: ${width};
                height: ${height};
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                border-radius: calc(${height} / 2);
            }

            input + .ui-SwitchControl::after {
                background: #fff;
                width: calc(${height} - 6px);
                height: calc(${height} - 6px);
                content: '';
                position: absolute;
                left: 0;
                top: 3px;
                border-radius: 50%;
                transform: translateX(3px);
                transition: background-color 0.25s ease 0s, transform 0.25s ease 0s, box-shadow 0.15s ease 0s;
            }

            input:checked + .ui-SwitchControl::before {
                ${getColorStyle('background', checkedBackground, theme)};
            }

            input:checked + .ui-SwitchControl::after {
                transform: translateX(calc(${width} / 2));
                transition: background-color 0.25s ease 0s, transform 0.25s ease 0s, box-shadow 0.15s ease 0s;
            }

            input:disabled + .ui-SwitchControl::before {
                ${getColorStyle('background', disabledBackground, theme)};
            }
        `;
    };
