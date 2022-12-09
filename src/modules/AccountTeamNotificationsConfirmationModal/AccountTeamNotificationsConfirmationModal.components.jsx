import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box, Message } from 'hdruk-react-core';
import { teamNotificationsPropTypes } from 'types';

const EmailList = ({ notifications }) => {
    const { t } = useTranslation();

    if (isEmpty(notifications)) return null;

    return (
        <>
            {notifications.map((notification, i) => {
                const { subscribedEmails = [], notificationType = '' } = notification;

                if (isEmpty(subscribedEmails)) return null;

                return (
                    <Box display='flex' pt={6} pb={8} key={`teamEmail-${notificationType}-${i}`}>
                        <Box flexBasis='125px'>
                            <Message>{t('team.email')}</Message>
                        </Box>
                        <Box flexGrow='1'>{subscribedEmails.map(obj => obj.value).join(', ')}</Box>
                    </Box>
                );
            })}
        </>
    );
};

EmailList.propTypes = {
    notifications: teamNotificationsPropTypes.isRequired,
};

export { EmailList };
