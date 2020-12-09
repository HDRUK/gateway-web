import React, { useState, Fragment } from 'react';

const MessageFooter = ({ onSubmitMessage, onMessageChange, value }) => {
	return (
		<Fragment>
			<form
				onSubmit={e => {
					onSubmitMessage(e);
				}}>
				<div className='form-group'>
					<textarea
						className='form-control'
						type='text'
						value={value}
						name='name'
						onChange={e => {
							onMessageChange(e);
						}}
					/>
				</div>
				<button className='button-secondary' type='submit'>
					Submit
				</button>
			</form>
		</Fragment>
	);
};

export default MessageFooter;
