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

const teamGatewayNotificationPropTypes = shape({
    subscribedEmails: arrayOf(shape({ value: string, error: string })),
    optIn: bool,
    notificationType: string,
});

const teamGatewayNotificationsPropTypes = arrayOf(teamGatewayNotificationPropTypes);

const memberPropTypes = shape({
    lastname: string,
    firstname: string,
    id: number,
    bio: string,
    organisation: string,
});

export { userStatePropTypes, teamGatewayNotificationPropTypes, teamGatewayNotificationsPropTypes, memberPropTypes };
