import React from 'react';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box, Message } from 'hdruk-react-core';

const EmailList = ({ notifications }) => {
    const { t } = useTranslation();

    return (
        <>
            {notifications.map((notification, i) => {
                const { subscribedEmails = [], notificationType = '' } = notification;

                if (!isEmpty(subscribedEmails)) {
                    return (
                        <Box display='flex' pt={6} pb={8} key={`teamEmail-${notificationType}-${i}`}>
                            <Box flexBasis='125px'>
                                <Message>{t('team.email')}</Message>
                            </Box>
                            <Box flexGrow='1'>
                                {subscribedEmails.map(obj => `${obj.value}${i === subscribedEmails.length - 1 ? '' : ','} `)}
                            </Box>
                        </Box>
                    );
                }

                return '';
            })}
        </>
    );
};

export default EmailList;
