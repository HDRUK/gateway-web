import { css } from '@emotion/react';
import { getSize } from 'hdruk-react-core';
import { getComponentGlobals } from '../../configs/theme';

const styles = theme => {
    const { borderColor } = getComponentGlobals('Table', theme);

    return css`
        td {
            font-size: 14px;
            font-weight: 700;
            padding: 0 ${getSize(6, theme)};
            border-bottom: 1px solid ${borderColor};
        }

        th {
            padding-top: ${getSize(3, theme)};
            padding-bottom: ${getSize(3, theme)};
        }
    `;
};

export default styles;
