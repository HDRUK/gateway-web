import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Alert, LayoutContent } from 'components';
import { useAuth } from '../../../../context/AuthContext';
import { isCustodian, userHasRole } from '../../../../utils/auth';

import DataUsePage from '../../../dataUse/DataUsePage';
import DataUseUpload from '../../../dataUse/upload/DataUseUpload';
import DataUseWidget from '../../../dataUse/widget/DataUseWidget';
import { userTypes } from '../../Team/teamUtil';

const AccountDataUse = ({ tabId, team, publisherDetails }) => {
    const { userState } = useAuth();
    const history = useHistory();
    const {
        location: { state: historyState },
    } = history;
    // TODO: GAT-1510:015
    const isManager = userHasRole(userState, team, userTypes.MANAGER);

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

            {tabId === 'datause' && dataUseUpload && <DataUseUpload userState={userState} team={team} onSubmit={handleSubmitUpload} />}

            {tabId === 'datause' && !dataUseUpload && (
                <DataUsePage userState={userState} team={team} onClickDataUseUpload={handleClickUpload} />
            )}

            {/* TODO: GAT-1510:053 */}
            {tabId === 'datause_widget' && isCustodian(team) && isManager && publisherDetails?.dataUse?.widget?.enabled && (
                <DataUseWidget userState={userState} team={team} publisherDetails={publisherDetails} />
            )}
        </>
    );
};

AccountDataUse.defaultProps = {
    onSelectTab: () => {},
};

export default AccountDataUse;
