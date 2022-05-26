import { css } from '@emotion/react';

export const root =
    ({ size, color, stroke, fill }) =>
    theme => {
        const {
            colors,
            components: {
                Icon: { sizes },
            },
        } = theme;

        return css`
            display: inline-flex;
            stroke: ${stroke};
            color: ${colors[color]};
            fill: ${colors[fill]};
            height: ${size === 'contained' ? '1em' : sizes[size]};
            width: ${size === 'contained' ? '1em' : sizes[size]};
            justify-content: center;
            align-items: center;
            flex-shrink: 0;

            svg,
            img {
                width: 100%;
                height: 100%;
            }
        `;
    };
