import React, { Fragment } from 'react';
import '../../DataAccessRequest.scss';

const ApplicantActionButtons = ({
	allowedNavigation = false,
	onFormSubmit,
	onNextClick,
	onShowContributorModal,
	onEditForm,
	showSubmit,
	submitButtonText,
	showEdit,
}) => {
	return (
		<Fragment>
			<button className={`button-tertiary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onShowContributorModal()}>
				Contributors
			</button>
			{showSubmit ? (
				<button className={`button-secondary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onFormSubmit()}>
					{submitButtonText}
				</button>
			) : (
				''
			)}
			{showEdit ? (
				<button className={`button-secondary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onEditForm()}>
					Edit
				</button>
			) : (
				''
			)}
			<button className={`button-primary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onNextClick()}>
				Next
			</button>
		</Fragment>
	);
};

export default ApplicantActionButtons;
