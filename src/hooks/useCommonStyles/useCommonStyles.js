import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';
import { getCommonStyles } from '../../configs/theme';

const useCommonStyles = props => {
    const theme = useTheme();

    return css`
        ${getCommonStyles(props, theme)}
    `;
};

export default useCommonStyles;
