import React, { Fragment } from 'react';

const AmendmentCount = ({ answeredAmendments, unansweredAmendments }) => {
	return answeredAmendments > 0 || unansweredAmendments > 0 ? (
		<Fragment>
			<div className='amendment-count mr-3'>
				{answeredAmendments} new update{answeredAmendments === 1 ? '' : 's'}
			</div>
		</Fragment>
	) : (
		''
	);
};

export default AmendmentCount;
