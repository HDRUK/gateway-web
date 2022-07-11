import React from 'react';
import _ from 'lodash';

const AlertBox = ({ status = '', text = '' }) => {

	const renderIcon = (icon = '') => {
		if (!_.isEmpty(icon)) {
			return <i className={iconMapper[icon]} />;
		}
		return '';
	};

	return (
		<div className={alertClassMapper[status]}>
			<div className='alert-wrap'>
				<div>
					{renderIcon(status)} {text}
				</div>
			</div>
		</div>
	);
};

AlertBox.defaultProps = {
	status: '',
	text: '',
};

const iconMapper = {
	WARNING: 'fas fa-exclamation-circle',
	DANGER: 'fas fa-exclamation-circle',
	SUCCESS: 'fas fa-check',
};

const alertClassMapper = {
	WARNING: 'alert alert-warning',
	DANGER: 'alert alert-danger',
	SUCCESS: 'alert alert-success',
};

export default AlertBox;
