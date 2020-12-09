import React, { useState, Fragment } from 'react';
import { isEmpty } from 'lodash';
import '../../DataAccessRequest.scss';
const NavItem = ({ parentForm, questionPanels, onFormSwitchPanel, activePanelId, enabled, notForReview }) => {
	const onClickItem = (e, panel) => {
		e.preventDefault();
		if (enabled) {
			onFormSwitchPanel(panel);
		}
	};

	const buildNavItem = () => {
		let qPanels = [...questionPanels];
		const baseClasses = 'dar-nav-item text-size-small ';
		if (!isEmpty(qPanels)) {
			return qPanels.map((item, index) => {
				if (parentForm.pageId === item.pageId && item.navHeader) {
					let classes = item.panelId === activePanelId ? baseClasses + ' nav-item-active ' : baseClasses;
					classes = notForReview === true ? classes + ' section-not-inreview' : classes + ' gray800-14';

					return (
						<li className={classes} style={{ cursor: 'pointer' }} key={index} onClick={e => onClickItem(e, item)}>
							{item.navHeader}
						</li>
					);
				}
			});
		}
	};

	return <Fragment>{buildNavItem()}</Fragment>;
};

export default NavItem;
