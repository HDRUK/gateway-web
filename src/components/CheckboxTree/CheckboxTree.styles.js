import { css } from '@emotion/react';
import { checkboxMixins } from 'configs/theme';

export const root =
    ({ hasLeafIcon, hasParentIcon, checkboxVariant: variant }) =>
    theme => {
        const {
            colors,
            base: { increment },
            components: {
                Checkbox: { height, width, variants },
            },
        } = theme;

        return css`
            .react-checkbox-tree {
                font-size: 1em;
            }
            .react-checkbox-tree > ol {
                width: 100%;
            }

            .rct-node {
                word-wrap: break-word;
            }

            ${!hasParentIcon &&
            `.rct-node-parent > .rct-text .rct-node-icon {
			display: none;
		}`}

            ${!hasLeafIcon &&
            `.rct-node-leaf > .rct-text .rct-node-icon {
				display: none;
			}`}

		label {
                display: flex;
            }

            label:hover {
                background: none;
            }

            .rct-collapse {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 0 0 ${width};
            }

            .rct-collapse:focus {
                outline: none;
            }

            .rct-collapse,
            .rct-checkbox,
            .rct-node-icon {
                margin: 0 ${increment}px 0 0;
                padding: 0;
            }

            .rct-checkbox .rct-icon {
                width: ${width};
            }

            .rct-title {
                padding: 0 0 0 ${increment}px;
            }

            .rct-text {
                padding: 0 0 ${2 * increment}px 0;
            }

            input + .rct-checkbox {
                position: relative;
                width: ${width};
                height: ${height};
            }

            label:hover .rct-icon-uncheck::before {
                background: ${colors[variants[variant].hoverBackground]};
            }

            input + .rct-checkbox .rct-icon::before {
                ${checkboxMixins.before({ colors, variants, variant, width, height })}
            }

            input + .rct-checkbox .rct-icon::after {
                ${checkboxMixins.after({ width, height })}
            }

            input:disabled + .rct-checkbox .rct-icon-uncheck::after {
                ${checkboxMixins.disabledNotChecked({ width, height })}
            }

            input + .rct-checkbox .rct-icon-check::after,
            input + .rct-checkbox .rct-icon-half-check::after {
                ${checkboxMixins.checked({ colors, variants, variant })}
            }

            input + .rct-checkbox .rct-icon-half-check::after {
                ${checkboxMixins.partial({ width, height })}
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            input:disabled + .rct-checkbox .rct-icon::after {
                ${checkboxMixins.disabled({ colors, variants, variant })}
            }

            label:hover input ~ *,
            label:hover input ~ * * {
                cursor: pointer;
            }

            .rct-disabled label {
                cursor: default;
            }

            label:hover input:disabled ~ *,
            label:hover input:disabled ~ * *,
            label:hover input:disabled + .rct-checkbox .rct-icon::after,
            label:hover input:disabled + .rct-checkbox .rct-icon::before {
                cursor: default;
            }

            label:hover input:disabled + .rct-checkbox .rct-icon-uncheck::before {
                background: none;
            }
        `;
    };
