import { css } from '@emotion/react';

export const publisherLogoCSS = publisherLogo => css`
    background-image: url('${publisherLogo}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: content-box;
`;
export const pointer = css`
    cursor: pointer;
`;
