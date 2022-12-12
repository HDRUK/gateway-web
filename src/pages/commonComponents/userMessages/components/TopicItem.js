import React from 'react';
import moment from 'moment';
import NotificationBadge from 'react-notification-badge';
import '../UserMessages.scss';

const TopicItem = props => {
    const {
        onTopicClick,
        topic: { createdDate, title, subTitle, _id, unreadMessages = 0, active = false },
    } = props;

    const onItemClick = (e, id) => {
        e.preventDefault();
        onTopicClick(id);
    };
    const setCreatedDate = () => {
        if (typeof createdDate !== 'undefined') {
            let reg = /^.*new.*$/gim;
            return reg.test(createdDate) ? 'New message' : moment(createdDate).format('DD MMM HH:mm');
        } else {
            return '';
        }
    };

    return (
        <div className={`sideDrawer-nav-item ${active ? 'selected-item' : ''}`} onClick={e => onItemClick(e, _id)}>
            <div className='nav-meta'>
                <div className='nav-meta--date gray500-13'>{setCreatedDate()}</div>
                <div className='nav-meta--alert'>
                    {unreadMessages > 0 ? <NotificationBadge count={unreadMessages} style={{ backgroundColor: '#29235c' }} /> : ''}
                </div>
            </div>
            <div className='nav-title black-bold-16'>{subTitle}</div>
            <div className='nav-desc gray500-13'>{title}</div>
        </div>
    );
};

export default TopicItem;
