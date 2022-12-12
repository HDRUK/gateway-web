import React from 'react';
import TopicItem from './TopicItem';
import '../UserMessages.scss';

const TopicList = ({ topics, onTopicClick }) => {
    const topicList = [...topics];

    const topicClick = id => {
        onTopicClick(id);
    };

    const topicItems = [...topicList].map(topic => <TopicItem key={topic._id} topic={topic} onTopicClick={topicClick} />);

    return <div className='sideDrawer-nav'>{topicItems}</div>;
};

export default TopicList;
