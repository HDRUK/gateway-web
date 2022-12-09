/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import rootStyles from './NotificationBadge.styles';

const NotificationBadge = ({ count, ...props }) => {
    return (
        <div css={rootStyles} {...props}>
            {count}
        </div>
    );
};

NotificationBadge.propTypes = {
    count: PropTypes.number.isRequired,
};

export default NotificationBadge;
