/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { toTitleCase } from '../../../../utils/GeneralHelper.util';
import * as styles from '../Dataset/Dataset.styles';
import '../../CommonComponents.scss';

const Tag = props => {
	const { tagName, tagType, activeLink, onSearchPage, updateOnFilterBadgeHandler, parentKey, url, showTagType } = props;
	const dispayTagName = showTagType ? `${toTitleCase(tagType)}: ${tagName}` : tagName;
	if (activeLink) {
		if (onSearchPage) {
			return (
				<span
					css={styles.pointer}
					onClick={event => updateOnFilterBadgeHandler(parentKey, { label: tagName, parentKey: parentKey })}
					data-testid={`badge-${tagName}-span`}>
					<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
						{dispayTagName}
					</div>
				</span>
			);
		} else {
			return (
				<a href={`${url}${tagName}`} data-testid={`badge-${tagName}-link`}>
					<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
						{dispayTagName}
					</div>
				</a>
			);
		}
	} else {
		return (
			<div className={`badge-${tagType}`} data-testid={`badge-${tagName}`}>
				{props.children}
				{dispayTagName}
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
	url: PropTypes.string.isRequired,
	updateOnFilterBadgeHandler: PropTypes.func.isRequired,
	showTagType: PropTypes.bool.isRequired,
};

export default Tag;
