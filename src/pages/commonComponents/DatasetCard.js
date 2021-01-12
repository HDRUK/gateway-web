import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import SVGIcon from '../../images/SVGIcon';
import SLA from '../commonComponents/sla/SLA';
import TimeDuration from './timeDuration/TimeDuration';
import AccessActivity from '../../pages/dashboard/DataAccessRequests/AccessActivity/AccessActivity';
import DarHelperUtil from '../../utils/DarHelper.util';
import CommentItem from '../dashboard/DataAccessRequests/CommentItem/CommentItem.js';
import { ReactComponent as MetadataCompleteSvg } from '../../images/metadata_complete.svg';
import { ReactComponent as MetadataEmptySvg } from '../../images/metadata_empty.svg';
import { ReactComponent as MetadataHalfDoneSvg } from '../../images/metadata_half_done.svg';
import '../commonComponents/DatasetCard.scss';

export const DatasetCard = props => {
	//hover state section completion status wheels
	const [documentationHover, setDocumentationHover] = useState(false);

	// const [inFirstNameHover, setFirstNameHover] = useState(false);
	// const [inLastNameHover, setLastNameHover] = useState(false);
	// const [inEmailHover, setEmailHover] = useState(false);
	// const [inSectorHover, setSectorHover] = useState(false);
	// const [inOrgHover, setOrgHover] = useState(false);
	// const [inBioHover, setBioHover] = useState(false);
	// const [inDomainHover, setDomainHover] = useState(false);
	// const [inLinkHover, setLinkHover] = useState(false);
	// const [inOrcidHover, setOrcidHover] = useState(false);
	let { publisher, title, version, isDraft, datasetStatus, documentationStatus } = props;

	//old dar variables
	let request = '',
		i = '',
		team = '';
	let {
		// publisher = '',
		applicationStatus,
		_id,
	} = request;
	//old

	const handleMouseHover = () => {
		console.log('documentationHover was ...', documentationHover);
		setDocumentationHover(!documentationHover);
	};

	const getCompletionStatusWheel = status => {
		switch (status) {
			case 'complete':
				return <MetadataCompleteSvg className='margin-right-4'></MetadataCompleteSvg>;
			case 'inProgress':
				return <MetadataHalfDoneSvg className='margin-right-4'></MetadataHalfDoneSvg>;
			default:
				return <MetadataEmptySvg className='margin-right-4'></MetadataEmptySvg>;
		}
	};

	return (
		<Row
			key={`request_${i}`}
			// onClick={event =>  window.location.href=`/data-access-request/${request._id}`}>
			onClick={e => this.navigateToLocation(e, _id, applicationStatus)}>
			<div className='col-md-12'>
				<div className='layoutCard'>
					<div className='header'>
						<div className='header-title'>
							<h1>{title}</h1>
						</div>
						<div className='header-status'>
							{datasetStatus === 'isPending' ? (
								// diff = this.calculateTimeDifference(createdAt);
								// <TimeDuration text={`${diff} days since start`} />
								<TimeDuration text={`${0} days since start`} />
							) : (
								''
							)}
							{/* {this.renderDuration(request, team)} */}
							{/* {isDraft ? <SLA classProperty={'gray'} text='Draft' /> : 'hello'} */}
							{isDraft ? <div className='margin-right-4 sla-gray'>Draft</div> : ''}
							{/* <SLA classProperty={DarHelperUtil.darStatusColours[datasetStatus]} text={DarHelperUtil.darSLAText[datasetStatus]} /> */}
							<SLA classProperty={DarHelperUtil.darStatusColours[datasetStatus]} text={DarHelperUtil.darSLAText[datasetStatus]} />
						</div>
					</div>
					<Row className='dataset-completion-wheels'>
						<Col onMouseEnter={() => setDocumentationHover(true)} onMouseLeave={() => setDocumentationHover(false)}>
							{documentationHover && (
								<div className='accountClassToolTip'>
									<span className='white-13-semibold'>Documentation: {documentationStatus}</span>
								</div>
							)}
							{getCompletionStatusWheel(documentationStatus)}
							<MetadataCompleteSvg className='margin-right-4'></MetadataCompleteSvg>
						</Col>
						<Col>
							<MetadataEmptySvg className='margin-right-4'></MetadataEmptySvg>
						</Col>
						<Col>
							<MetadataHalfDoneSvg className='margin-right-4'></MetadataHalfDoneSvg>
						</Col>
					</Row>
					<div className='body'>
						<Fragment>
							<div className='box'>Publisher</div>
							<div className='box'>{publisher}</div>
							<div className='box'>Version</div>
							<div className='box'>
								{version}
								{isDraft ? ' (Draft)' : ''}
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
					{/* {this.renderComment(
						applicationStatusDesc,
						applicationStatus,
						decisionComments,
						reviewPanels,
						decisionMade,
						decisionApproved,
						decisionDate
					)} */}
				</div>
			</div>
		</Row>
	);
};

export default DatasetCard;
