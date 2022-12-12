import { css } from '@emotion/react';

export const root = css`
    padding: 0;
    font-size: 1em;
`;

export const listItem = css`
    display: flex;
    position: relative;

    &:last-child .timeline-icon:after {
        display: none;
    }
`;

export const timeline = css`
    min-width: 85px;
    max-width: 85px;
    display: flex;
`;

export const icon = css`
    position: relative;
    height: 100%;
    line-height: 0;

    &:after {
        position: absolute;
        content: '';
        left: calc(50% - 2px);
        top: 0;
        bottom: 0;
        border-left: 4px solid #f6f7f8;
    }

    > div {
        background: #fff;
        z-index: 1;
        position: relative;
        transform: translateY(-15%);
    }
`;

export const time = theme => css`
    margin-left: 16px;
    color: ${theme.colors.grey700};
`;

export const content = css`
    flex-grow: 1;
    margin-left: 24px;
    padding-bottom: 24px;
`;
