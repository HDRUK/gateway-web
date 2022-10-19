import PropTypes from 'prop-types';

export const propTypesMember = PropTypes.shape({
    lastname: PropTypes.string,
    firstname: PropTypes.string,
    id: PropTypes.number,
    bio: PropTypes.string,
    organisation: PropTypes.string,
});
