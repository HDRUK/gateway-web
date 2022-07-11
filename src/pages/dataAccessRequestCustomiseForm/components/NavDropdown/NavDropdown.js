import React, { useState } from 'react';
import _ from 'lodash';

const NavDropdown = ({ options, onFormSwitchPanel, enabled }) => {
	const { questionPanels } = options;
	const { pages } = options;
	const { allowsMultipleDatasets } = options;
	const aboutNavItem = {
		pageId: 'about',
		panelId: 'about',
		navHeader: '',
	};

	if (allowsMultipleDatasets && !questionPanels.some(q => q.pageId === 'about')) {
		questionPanels.unshift(aboutNavItem);
	}

	const [selectedOption, setSelectedOption] = useState(questionPanels[0].panelId, '');

	const onChangeHandler = e => {
		let panelId = e.target.value;
		let { pageId } = questionPanels.find(q => q.panelId === panelId);
		setSelectedOption(panelId);
		onFormSwitchPanel({ pageId, panelId });
	};

	const buildOption = o => {
		let { title } = [...pages].find(p => p.pageId === o.pageId);
		return <option value={o.panelId} key={o.panelId}>{`${title} ${_.isEmpty(o.navHeader) === true ? '' : '- ' + o.navHeader}`}</option>;
	};

	return (
		<select disabled={!enabled} value={selectedOption} onChange={e => onChangeHandler(e)}>
			{questionPanels.map(o => buildOption(o))}
		</select>
	);
};

export default NavDropdown;
