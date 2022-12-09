import { useState } from 'react';

import { CSVLink } from 'react-csv';
import { Button } from 'hdruk-react-core';
import { darHelperUtils } from 'utils';

const ActivityLogActionButtons = ({ team, latestVersion, onClickAddNewEvent, activityLog, onClickStartReview }) => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [exportFileName, setExportFileName] = useState('');

    const onClickDownloadActivityLog = () => {
        setActivityLogs(activityLog.current.getLogsAsArray());
        setExportFileName(activityLog.current.getExportFileName());
    };

    return (
        <>
            <CSVLink data={activityLogs} filename={exportFileName}>
                <Button variant='secondary' onClick={onClickDownloadActivityLog}>
                    Download activity log
                </Button>
            </CSVLink>

            {team !== 'user' && (
                <Button variant='secondary' onClick={() => onClickAddNewEvent()}>
                    + Add new event
                </Button>
            )}

            {(Object.values(latestVersion.versionTree) || [])
                .filter(version => version.applicationStatus === darHelperUtils.darStatus.submitted)
                .map(submittedVersion => {
                    return (
                        team !== 'user' && (
                            <Button
                                id='startReview'
                                onClick={e => {
                                    onClickStartReview(e, submittedVersion.applicationId);
                                }}>
                                Start review: {submittedVersion.displayTitle}
                            </Button>
                        )
                    );
                })}

            {(team === 'user' || latestVersion.applicationStatus !== darHelperUtils.darStatus.submitted) && (
                <a href={latestVersion.versions[0].link}>
                    <Button>View application form</Button>
                </a>
            )}
        </>
    );
};

export default ActivityLogActionButtons;
