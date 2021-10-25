/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import '../../CommonComponents.scss';
import * as styles from '../Dataset/Dataset.styles';

const Title = props => {
	const { type, name, id, className, onClickHandler, activeLink } = props;
	return activeLink ? (
		<>
			<a
				onClick={onClickHandler}
				className={className ? className : 'purple-bold-16'}
				css={styles.pointer}
				href={`/${type}/${id}`}
				data-testid={`title-${type}-${id}`}>
				{name}
			</a>
			{props.children}
		</>
	) : (
		<>
			<span className={className ? className : 'black-bold-16'} data-testid={`title-${type}-${id}`}>
				{' '}
				{name}
			</span>
			{props.children}
		</>
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
	type: 'title',
};

export default Title;
