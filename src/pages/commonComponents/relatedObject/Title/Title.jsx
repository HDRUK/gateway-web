/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import '../../CommonComponents.scss';
import * as styles from '../Dataset/Dataset.styles';

const Title = ({ type, name, id, className, onClickHandler, activeLink }) => {
	return activeLink ? (
		<a
			onClick={onClickHandler}
			className={className ? className : 'purple-bold-16'}
			css={styles.pointer}
			href={`/${type}/${id}`}
			data-testid={`${type}-title`}>
			{name}
		</a>
	) : (
		<span className={className ? className : 'black-bold-16'} data-testid={`${type}-title`}>
			{' '}
			{name}
		</span>
	);
};

Title.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	activeLink: PropTypes.bool,
	onClickHandler: PropTypes.func,
	className: PropTypes.string,
};

Title.defaultProps = {
	activeLink: false,
};

export default Title;
