import { css } from '@emotion/react';
import { getComponentStylesFromTheme } from '../../configs/theme';

export const root =
    ({ color, fill, fontSize }) =>
    theme => {
        const {
            base: { unit, increment },
        } = theme;

        return css`
            gap: ${increment * 2}${unit};
            background: none;
            border: none;
            padding: 0;

            ${getComponentStylesFromTheme(
                {
                    color,
                    fill,
                    fontSize,
                },
                theme
            )};

            &:hover {
                cursor: pointer;
            }

            .ui-Icon {
                fill: inherit;
                color: inherit;
            }
        `;
    };
