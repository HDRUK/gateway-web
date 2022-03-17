import PropTypes from 'prop-types';

export const ACTIVITY_LOG_PROP_TYPES = PropTypes.shape({
    version: PropTypes.string.isRequired,
    versionNumber: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        dateSubmitted: PropTypes.string,
        dateCreated: PropTypes.string,
        applicationStatus: PropTypes.string,
    }).isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            eventType: PropTypes.string.isRequired,
            logType: PropTypes.string.isRequired,
            timestamp: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            userDetails: PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string,
                role: PropTypes.string,
            }).isRequired,
            version: PropTypes.string.isRequired,
            versionId: PropTypes.string.isRequired,
            userTypes: PropTypes.arrayOf(PropTypes.string),
            adminComment: PropTypes.string.isRequired,
            datasetUpdates: PropTypes.arrayOf(
                PropTypes.objectOf(
                    PropTypes.shape({
                        previousAnswer: PropTypes.string,
                        updatedAnswer: PropTypes.string,
                    })
                )
            ),
        })
    ),
});
