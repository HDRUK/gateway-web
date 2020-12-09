import React, { useState, Fragment } from 'react';
import moment from 'moment';
import { create } from 'lodash';

const Message = ({ messageDescription, createdBy, createdDate }) => {
	const getName = () => {
		if (typeof createdBy === 'undefined') return '';

		if (typeof createdBy === 'string') return createdBy;

		let { firstname = '', lastname = '' } = createdBy;
		return `${firstname} ${lastname}`;
	};

	return (
		<Fragment>
			<div className='messageArea-item'>
				<div className='messageArea-item-header'>
					<div className='black-14-bold'>{getName()}</div>
					<div className='gray500-13'>{moment(createdDate).format('DD MMM HH:mm')}</div>
				</div>
				<p>{messageDescription}</p>
			</div>
		</Fragment>
	);
};

export default Message;
