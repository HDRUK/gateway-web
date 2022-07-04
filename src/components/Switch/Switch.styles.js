import { css } from '@emotion/react';

export const root =
    ({ disabled }) =>
    theme => {
        const {
            components: {
                Switch: { background, checkedBackground, disabledBackground },
                SwitchControl: { background },
            },
        } = theme;

        return css`
            position: relative;
            cursor: pointer;

            input {
                display: none;
            }

            & > .ui-SwitchControl {
                position: relative;
                padding-left: 50px;
                padding-top: 4px;
            }

            input + .ui-SwitchControl::before {
                background: #dc3645;
                width: 42px;
                height: 24px;
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                border-radius: 21px;
            }

            input + .ui-SwitchControl::after {
                background: #fff;
                width: 18px;
                height: 18px;
                content: '';
                position: absolute;
                left: 0;
                top: 3px;
                border-radius: 50%;
                transform: translateX(3px);
                transition: background-color 0.25s ease 0s, transform 0.25s ease 0s, box-shadow 0.15s ease 0s;
            }

            input:checked + .ui-SwitchControl::before {
                background: #2c8267;
            }

            input:checked + .ui-SwitchControl::after {
                transform: translateX(21px);
                transition: background-color 0.25s ease 0s, transform 0.25s ease 0s, box-shadow 0.15s ease 0s;
            }
        `;
    };
