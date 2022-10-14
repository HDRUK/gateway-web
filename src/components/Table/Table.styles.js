import { css } from '@emotion/react';
import { getComponentSerializable, getSize } from 'hdruk-react-core';
import { getColorStyle, getComponentGlobals } from '../../configs/theme';

const styles = theme => {
    const { borderColor } = getComponentGlobals('Table', theme);
    const { padding } = getComponentSerializable('CardBody', theme);

    return css`
        font-size: ${theme.font.size.md};

        thead {
            @media screen and (max-width: ${theme.breakpoints.sm}) {
                display: none;
            }
        }

        tr {
            @media screen and (max-width: ${theme.breakpoints.sm}) {
                ${getComponentSerializable('Card', theme)};
                margin-bottom: ${getSize(3, theme)};
                display: block;
            }
        }

        th,
        td {
            border-bottom: 1px solid;
            ${getColorStyle('border-color', borderColor, theme)}

            @media screen and (max-width: ${theme.breakpoints.sm}) {
                border: none;
            }
        }

        th {
            padding: ${getSize(3, theme)} ${getSize(6, theme)};
            font-weight: 700;
        }

        td {
            padding: ${getSize(7, theme)} ${getSize(6, theme)};

            @media screen and (max-width: ${theme.breakpoints.sm}) {
                display: block;
                text-align: right;
                padding: 0 ${padding};

                :first-child {
                    padding-top: ${padding};
                }

                :last-child {
                    padding-bottom: ${padding};
                }

                :not(:last-child) {
                    margin-bottom: ${getSize(2, theme)};
                }

                :before {
                    float: left;
                    content: attr(data-label);
                    text-transform: uppercase;
                    font-weight: 700;
                }
            }
        }
    `;
};

export default styles;
