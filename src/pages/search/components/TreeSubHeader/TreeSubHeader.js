/** @jsx jsx */
import { jsx } from '@emotion/react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from '../../../../components/Icon';
import { ReactComponent as ChevronBottomIcon } from '../../../../images/chevron-bottom.svg';
import { ReactComponent as ChevronRightIcon } from '../../../../images/chevron-right.svg';
import { ReactComponent as InfoIcon } from '../../../../images/info.svg';
import * as styles from './TreeSubHeader.styles.js';

const TreeSubHeader = ({ node }) => {
    const { label, tooltip, closed } = node;

    return (
        <div css={styles.root}>
            <Icon svg={!closed ? <ChevronBottomIcon /> : <ChevronRightIcon />} mr={2} color='purple500' fill='purple500' />

            <span className={closed ? '' : 'selected'}>{label}</span>
            {tooltip !== null && (
                <OverlayTrigger placement='bottom' overlay={<Tooltip>{tooltip}</Tooltip>}>
                    <Icon svg={<InfoIcon />} ml={1} color='purple500' fill='purple500' size='sm' />
                </OverlayTrigger>
            )}
        </div>
    );
};

export default TreeSubHeader;
