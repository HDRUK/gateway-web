import { css } from '@emotion/react';

export default css`
    display: inline-block;
    position: relative;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    color: white;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 10px;
    background-color: #29235c;

    -webkit-animation: scaleOnLoad 1s;
    animation: scaleOnLoad 1s;
    -webkit-transform: scale(2, 2);
    transform: scale(2, 2);
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;

    @-webkit-keyframes scaleOnLoad {
        100% {
            -webkit-transform: scale(1, 1);
        }
    }

    @keyframes scaleOnLoad {
        100% {
            transform: scale(1, 1);
        }
    }
`;
