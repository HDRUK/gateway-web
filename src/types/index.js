import { arrayOf, shape, number, string, bool } from 'prop-types';

const userStateType = arrayOf(
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

const teamGatewayNotificationsPropTypes = arrayOf(
    shape({
        subscribedEmails: arrayOf(shape({ value: string, error: string })),
        optIn: bool,
        notificationType: string,
    })
);

const memberPropTypes = shape({
    lastname: string,
    firstname: string,
    id: number,
    bio: string,
    organisation: string,
});

export { userStateType, teamGatewayNotificationsPropTypes, memberPropTypes };
