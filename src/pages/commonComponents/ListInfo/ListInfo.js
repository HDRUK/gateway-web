/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import * as styles from './ListInfo.styles';

const ListInfo = ({ data, className, widthCol1 }) => {
	return (
		<ul css={styles.root} className={className}>
			{data.map(({ label, value }, i) => (
				<li css={styles.listItem} key={`${i}-${label}`}>
					<div css={styles.col1(widthCol1)}>{label}</div>
					<div>{value}</div>
				</li>
			))}
		</ul>
	);
};

ListInfo.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
			value: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
		})
	).isRequired,
	widthCol1: PropTypes.string,
};

ListInfo.defaultProps = {
	widthCol1: '105px',
};

export default ListInfo;