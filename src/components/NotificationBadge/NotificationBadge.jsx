import PropTypes from 'prop-types';

const NotificationBadge = ({ count, ...props }) => {
    return <div {...props}>{count}</div>;
};

NotificationBadge.propTypes = {
    count: PropTypes.number.isRequired,
};

export default NotificationBadge;
