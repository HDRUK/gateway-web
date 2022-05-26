import { css } from '@emotion/react';
import { getComponentVariant } from '../../configs/theme';

export const root =
    ({ variant }) =>
    theme => {
        const {
            font: { size },
            base: { increment },
        } = theme;

        return css`
            border-width: 2px;
            border-style: solid;
            padding: ${increment * 3}px;
            display: flex;
            border-radius: 4px;
            line-height: 1;
            font-size: ${size.default};

            ${getComponentVariant('Alert', variant, theme)}
        `;
    };

export const icon = ({ base: { increment } }) => css`
    margin-right: ${increment * 2}px;
`;

export const content = () => css`
    flex-grow: 1;

    > *:last-child {
        margin-bottom: 0;
    }
`;
