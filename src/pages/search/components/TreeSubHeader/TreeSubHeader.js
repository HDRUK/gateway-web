/** @jsx jsx */
import { jsx } from '@emotion/react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from '../../../../components/Icon';
import * as styles from './TreeSubHeader.styles.js';

const TreeSubHeader = ({ node }) => {
	const { label, tooltip, closed } = node;

	return (
		<div css={styles.root}>
			<Icon size='xs' name='chevronbottom' inline mr={2} color='purple500' fill='purple500' />
			<span className={closed ? '' : 'selected'}>{label}</span>
			{tooltip !== null && (
				<OverlayTrigger placement='bottom' overlay={<Tooltip>{tooltip}</Tooltip>}>
					<Icon size='xs' name='info' inline ml={1} color='purple500' fill='purple500' />
				</OverlayTrigger>
			)}
		</div>
	);
};

export default TreeSubHeader;
