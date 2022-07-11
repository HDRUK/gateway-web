import React, { useState } from 'react';
import { Fragment } from 'react';
import DarHelperUtil from '../../../../utils/DarHelper.util';
import { CSVLink } from 'react-csv';

const ActivityLogActionButtons = ({ team, latestVersion, onClickAddNewEvent, activityLog, onClickStartReview }) => {
	const [activityLogs, setActivityLogs] = useState([]);
	const [exportFileName, setExportFileName] = useState('');

	const onClickDownloadActivityLog = () => {
		setActivityLogs(activityLog.current.getLogsAsArray());
		setExportFileName(activityLog.current.getExportFileName());
	};

	return (
		<Fragment>
			<CSVLink data={activityLogs} filename={exportFileName}>
				<button className={`button-secondary`} onClick={onClickDownloadActivityLog}>
					Download activity log
				</button>
			</CSVLink>

			{team !== 'user' && (
				<button className={`button-secondary`} onClick={() => onClickAddNewEvent()}>
					+ Add new event
				</button>
			)}

			{(Object.values(latestVersion.versionTree) || [])
				.filter(version => version.applicationStatus === DarHelperUtil.darStatus.submitted)
				.map(submittedVersion => {
					return (
						team !== 'user' && (
							<button
								id='startReview'
								className='button-primary'
								onClick={e => {
									onClickStartReview(e, submittedVersion.applicationId);
								}}>
								Start review: {submittedVersion.displayTitle}
							</button>
						)
					);
				})}

			{(team === 'user' || latestVersion.applicationStatus !== DarHelperUtil.darStatus.submitted) && (
				<a href={latestVersion.versions[0].link}>
					<button className={`button-primary`}>View application form</button>
				</a>
			)}
		</Fragment>
	);
};

export default ActivityLogActionButtons;
