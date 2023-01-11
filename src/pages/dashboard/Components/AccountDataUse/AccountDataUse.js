import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Alert, LayoutContent } from 'components';
import { authUtils } from 'utils';
import { useAuth } from '../../../../context/AuthContext';

import DataUsePage from '../../../dataUse/DataUsePage';
import DataUseUpload from '../../../dataUse/upload/DataUseUpload';
import DataUseWidget from '../../../dataUse/widget/DataUseWidget';

const AccountDataUse = ({ tabId, teamType, teamId, publisherDetails }) => {
    const { userState } = useAuth();
    const [isTeamManager, setisTeamManager] = useState(false);
    const history = useHistory();
    const {
        location: { state: historyState },
    } = history;

    useEffect(() => {
        // TODO: GAT-1510:015
        setisTeamManager(authUtils.getHasTeamManagerRole(userState, teamId));
    }, [teamId, userState]);

    const [dataUseUpload, setDataUseUpload] = useState(false);
    const [alertMessage, setAlertMessage] = useState(false);

    const handleClickUpload = useCallback(() => {
        setDataUseUpload(true);
    }, []);

    const handleSubmitUpload = useCallback(() => {
        setDataUseUpload(false);
    }, []);

    const handleAlertClose = useCallback(() => {
        setAlertMessage('');

        history.replace('/account?tab=datause', { state: null });
    }, [history]);

    useEffect(() => {
        if (historyState && historyState.alert) {
            setAlertMessage(historyState.alert.message);
        }
    }, [historyState]);

    return (
        <>
            {alertMessage && (
                <LayoutContent>
                    <Alert variant='success' dismissable onClose={handleAlertClose} mb={1}>
                        {alertMessage}
                    </Alert>
                </LayoutContent>
            )}

            {tabId === 'datause' && dataUseUpload && <DataUseUpload userState={userState} teamId={teamId} onSubmit={handleSubmitUpload} />}

            {tabId === 'datause' && !dataUseUpload && <DataUsePage userState={userState} onClickDataUseUpload={handleClickUpload} />}

            {/* TODO: GAT-1510:053 */}
            {tabId === 'datause_widget' &&
                authUtils.getIsTypeCustodian(teamType) &&
                isTeamManager &&
                publisherDetails?.dataUse?.widget?.enabled && (
                    <DataUseWidget userState={userState} teamId={teamId} publisherDetails={publisherDetails} />
                )}
        </>
    );
};

AccountDataUse.defaultProps = {
    onSelectTab: () => {},
};

export default AccountDataUse;
