import { css } from '@emotion/react';
import { getComponentSize, getComponentStylesFromTheme } from '../../configs/theme';

export const root =
    ({ color, fill, size }) =>
    theme => {
        const {
            base: { unit, increment },
        } = theme;

        return css`
            gap: ${increment * 2}${unit};

            ${getComponentStylesFromTheme(
                {
                    color,
                    fill,
                },
                theme
            )};

            ${getComponentSize('Cta', size, theme)}

            .ui-Icon,
            svg {
                height: 1.2em;
                width: 1.2em;
            }

            &:hover {
                cursor: pointer;
            }

            .ui-Icon {
                fill: inherit;
                color: inherit;
            }
        `;
    };
