import { css } from '@emotion/react';

export const root = props => theme => {
    const {
        colors,
        components: {
            Typography: {
                variants: {
                    [props.variant]: { fontSize, fontWeight, lineHeight, color },
                },
            },
        },
    } = theme;

    return css`
        font-size: ${fontSize} !important;
        line-height: ${lineHeight || 'normal'};
        color: ${colors[props.color || color || 'inherit']} !important;
        ${fontWeight && `font-weight: ${fontWeight};`}

        ${(props.variant === 'caption' || props.variant === 'tiny') && 'display: inline-block;'}
    `;
};
