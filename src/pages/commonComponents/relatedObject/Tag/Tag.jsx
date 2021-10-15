/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { toTitleCase } from '../../../../utils/GeneralHelper.util';
import * as styles from '../Dataset/Dataset.styles';
import '../../CommonComponents.scss';

const Tag = props => {
	const { tagName, tagType, activeLink, onSearchPage, updateOnFilterBadgeHandler, parentKey, filter, url, showTagType, version } = props;
	const displayTagName = showTagType ? (
		<>
			<span>{`${toTitleCase(tagType)}: ${tagName}`}</span>
			<span>{version}</span>
		</>
	) : (
		<>
			<span>{tagName}</span>
			<span>{version}</span>
		</>
	);
	if (activeLink) {
		if (onSearchPage) {
			return (
				<span
					css={styles.pointer}
					onClick={event => updateOnFilterBadgeHandler(filter, { label: tagName, parentKey: parentKey })}
					data-testid={`badge-${tagName}-span`}>
					<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
						{displayTagName}
					</div>
				</span>
			);
		} else {
			return (
				<a href={`${url}${tagName}`} data-testid={`badge-${tagName}-link`}>
					<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
						{displayTagName}
					</div>
				</a>
			);
		}
	} else {
		return (
			<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
				{props.children}
				{displayTagName}
			</div>
		);
	}
};

Tag.propTypes = {
	tagName: PropTypes.string.isRequired,
	tagType: PropTypes.string.isRequired,
	activeLink: PropTypes.bool.isRequired,
	onSearchPage: PropTypes.bool.isRequired,
	parentKey: PropTypes.string.isRequired,
	filter: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	updateOnFilterBadgeHandler: PropTypes.func.isRequired,
	showTagType: PropTypes.bool.isRequired,
	version: PropTypes.string,
};
Tag.defaultProps = {
	version: '',
	filter: '',
};

export default Tag;
