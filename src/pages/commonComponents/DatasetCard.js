import React, { Fragment, useState } from 'react';
import { OverlayTrigger, Tooltip, Row, Button, Accordion, Col } from 'react-bootstrap';
import _ from 'lodash';
import SLA from '../commonComponents/sla/SLA';
import TimeDuration from './timeDuration/TimeDuration';
import AccessActivity from '../../pages/dashboard/DataAccessRequests/AccessActivity/AccessActivity';
import DarHelperUtil from '../../utils/DarHelper.util';
import DatasetCardHelperUtil from './DatasetCardHelper.util';
import CommentItem from '../dashboard/DataAccessRequests/CommentItem/CommentItem.js';
import StatusDisplay from './StatusDisplay';
import SVGIcon from '../../images/SVGIcon';

import '../commonComponents/DatasetCard.scss';

export const DatasetCard = props => {
	let { publisher, title, version, isDraft, datasetStatus, completion, createdAt } = props;

	const [flagClosed, setFlagClosed] = useState(true);

	return (
		<Row
			key={`dataset_card_${title}`}
			// onClick={event =>  window.location.href=`/data-access-request/${request._id}`}>
			// onClick={e => this.navigateToLocation(e, _id, applicationStatus)}
		>
			<div className='col-md-12'>
				<div className='layoutCard'>
					<div className='header mb-0'>
						<div className='header-title'>
							<h1>{title}</h1>
						</div>
						<div className='header-status'>
							{datasetStatus === 'isPending' ? (
								<TimeDuration text={`${DatasetCardHelperUtil.calculateTimeDifference(createdAt)} days since start`} />
							) : (
								''
							)}
							{/* {isDraft ? <SLA classProperty={'gray'} text='Draft' /> : 'hello'} */}
							{isDraft ? <div className='margin-right-4 sla-gray'>Draft</div> : ''}
							{/* <SLA classProperty={DarHelperUtil.darStatusColours[datasetStatus]} text={DarHelperUtil.darSLAText[datasetStatus]} /> */}
							<SLA classProperty={DarHelperUtil.darStatusColours[datasetStatus]} text={DarHelperUtil.darSLAText[datasetStatus]} />
						</div>
					</div>
					<div className='dataset-completion-wheels'>
						{Object.keys(completion).map(key => (
							<OverlayTrigger
								key={key}
								placement='top'
								overlay={
									<Tooltip id={`tooltip-top`}>
										{key}: {completion[key]}
									</Tooltip>
								}>
								<div>
									<StatusDisplay section={key} status={completion[key]} />
								</div>
							</OverlayTrigger>
						))}
					</div>

					<div className='body'>
						<Fragment>
							<div className='box'>Publisher</div>
							<div className='box'>{publisher}</div>
							<div className='box'>Version</div>
							<div className='box'>
								{version}
								{isDraft ? ' (Draft)' : ` (${datasetStatus})`}
							</div>
							<div className='box version-list'>Version2</div>
							<div className='box'>
								<Accordion defaultActiveKey='1' style={{ width: '100%' }}>
									<Accordion.Toggle
										as={Button}
										variant='link'
										eventKey='0'
										onClick={() => setFlagClosed(!flagClosed)}
										data-testid='accordion-toggle'
										style={{ width: '100%', padding: '0px', border: '0px' }}
										className='version-list'>
										<div className='version-list'>
											4.99 (Example)
											<SVGIcon
												name='chevronbottom'
												fill={'#475da7'}
												style={{ width: '18px', height: '18px', paddingLeft: '4px' }}
												className={flagClosed === true ? 'svg-24' : 'svg-24 flipSVG'}
											/>
										</div>
									</Accordion.Toggle>
									<Accordion.Collapse eventKey='0' style={{ paddingRight: '20px' }}>
										<Fragment>
											<div className='version-list'>4.5 (Example)</div>
											<div className='version-list'>4.4 (Example)</div>
											<div className='version-list'>4.2 (Example)</div>
										</Fragment>
									</Accordion.Collapse>
								</Accordion>
							</div>

							<div className='box'>Last activity</div>
							{/* <div className='box'>
								{moment(updatedAt).format('D MMMM YYYY HH:mm')}
								{isTeam == true ? (
									<div className='box-meta'>
										{applicationStatus === DarHelperUtil.darStatus.submitted ? (
											<button
												id='startReview'
												className='button-primary'
												onClick={e => {
													onClickStartReview(e);
												}}>
												Start review
											</button>
										) : !_.isEmpty(reviewStatus) || !_.isEmpty(amendmentStatus) ? (
											setActivityMeta()
										) : (
											''
										)}
									</div>
								) : !_.isEmpty(amendmentStatus) ? (
									setActivityMeta()
								) : (
									''
								)}
							</div> */}
						</Fragment>
					</div>
					{datasetStatus === 'rejected' ? (
						<CommentItem
							text={'decisionComments'}
							title={'Phase decision'}
							subtitle={`${'decisionApprovedType'} ${'reviewPanels'}`}
							decisionDate={'decisionDate'}
						/>
					) : (
						''
					)}
				</div>
			</div>
		</Row>
	);
};

export default DatasetCard;
