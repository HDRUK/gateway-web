import React from 'react';
import { useHistory } from 'react-router-dom';
import Alert from '../../../../components/Alert';
import { LayoutContent } from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';
import { isCustodian } from '../../../../utils/auth';
import DataUsePage from '../../../dataUse/DataUsePage';
import DataUseUpload from '../../../dataUse/upload/DataUseUpload';
import DataUseWidget from '../../../dataUse/widget/DataUseWidget';

const AccountDataUse = ({ tabId, team, publisherDetails }) => {
    const { userState } = useAuth();
    const history = useHistory();

    const {
        location: { state: historyState },
    } = history;

    const [dataUseUpload, setDataUseUpload] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState(false);

    const handleClickUpload = React.useCallback(() => {
        setDataUseUpload(true);
    }, []);

    const handleSubmitUpload = React.useCallback(() => {
        setDataUseUpload(false);
    }, []);

    const handleAlertClose = React.useCallback(() => {
        setAlertMessage('');

        history.replace('/account?tab=datause', { state: null });
    }, [history]);

    React.useEffect(() => {
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

            {tabId === 'datause_widget' && isCustodian(team) && (
                <DataUseWidget userState={userState} team={team} publisherName={publisherDetails.name} />
            )}
        </>
    );
};

AccountDataUse.defaultProps = {
    onSelectTab: () => {},
};

export default AccountDataUse;
