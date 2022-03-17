import { css } from '@emotion/react';
import { mixins } from '../Input/Input.styles';

export const inputGroup =
    ({ variant, rows, error }) =>
    theme => {
        const {
            colors,
            components: {
                Textarea: { variants },
            },
        } = theme;

        return css`
            width: 100%;
            flex-direction: column;
            flex: 0 0 100%;

            textarea {
                ${mixins.input({ variant, error })({ colors, variants })}
                width: 100% !important;
                min-height: ${rows}em;
            }
        `;
    };

export const { formGroup } = mixins;

export const { label } = mixins;

export const charCount = ({ colors: { grey700Alt } }) => css`
    display: flex;
    color: ${grey700Alt};
`;

export const charCountValue = () => css`
    flex-grow: 1;
    text-align: right;
`;
