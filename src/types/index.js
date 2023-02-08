import { arrayOf, shape, number, string, bool } from 'prop-types';

const userStatePropTypes = arrayOf(
    shape({
        acceptedAdvancedSearchTerms: bool,
        advancedSearchRoles: arrayOf(string),
        email: string,
        id: number,
        loggedIn: bool,
        name: string,
        profileComplete: bool,
        provider: string,
        role: string,
        teams: arrayOf(
            shape({
                _id: string,
                isAdmin: bool,
                name: string,
                roles: arrayOf(string),
                type: string,
            })
        ),
        terms: bool,
    })
);

const subscribedEmailPropTypes = shape({ value: string, error: string });

const memberNotificationPropTypes = shape({ optIn: bool, notificationType: string });

const memberNotificationsPropTypes = arrayOf(memberNotificationPropTypes);

const teamNotificationPropTypes = shape({
    subscribedEmails: arrayOf(subscribedEmailPropTypes),
    optIn: bool,
    notificationType: string,
});

const teamNotificationsPropTypes = arrayOf(teamNotificationPropTypes);

const memberPropTypes = shape({
    lastname: string,
    firstname: string,
    userId: number,
    id: number,
    bio: string,
    organisation: string,
});

export {
    memberNotificationPropTypes,
    memberNotificationsPropTypes,
    subscribedEmailPropTypes,
    userStatePropTypes,
    teamNotificationPropTypes,
    teamNotificationsPropTypes,
    memberPropTypes,
};
