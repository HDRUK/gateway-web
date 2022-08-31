import { css } from '@emotion/react';
import { getSpacingStyle } from '../../../../configs/theme';

export default theme => css`
    background-color: ${theme.colors.yellow50};
    border: 1px solid;
    border-color: ${theme.colors.orange100};
    ${getSpacingStyle('padding', 4, theme)};

    pre {
        margin: 0;
    }
`;
