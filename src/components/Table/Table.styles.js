import { css } from '@emotion/react';
import { getSize } from 'hdruk-react-core';
import { getColorStyle, getComponentGlobals } from '../../configs/theme';

const styles = theme => {
    const { borderColor } = getComponentGlobals('Table', theme);

    return css`
        font-size: ${theme.font.size.md};

        th,
        td {
            border-bottom: 1px solid;
            ${getColorStyle('border-color', borderColor, theme)}
        }

        td {
            font-size: 14px;
            padding: ${getSize(7, theme)} ${getSize(6, theme)};
        }

        th {
            padding: ${getSize(3, theme)} ${getSize(6, theme)};
            font-weight: 700;
        }
    `;
};

export default styles;
