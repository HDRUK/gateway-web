import React from 'react';
import './DoubleDropdowncustom.scss';
import './SelectedOption.scss';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';

const SelectedOption = ({ text, close }) => {
	return (
		<span className='chip'>
			{text}{' '}
			<span onClick={close}>
				<CloseButtonSvg />
			</span>
		</span>
	);
};

export default SelectedOption;
