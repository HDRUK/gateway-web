import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DiscoursePost from './DiscoursePost';
import DiscourseAddPost from './DiscourseAddPost';
import NotFound from '../commonComponents/NotFound';

class DiscourseTopic extends Component {
  constructor(props) {
    super(props);
    this.state.topic = props.topic;
    this.state.toolId = props.toolId;
    this.state.userState = props.userState;
  }

  // initialize our state
  state = {
    topic: null,
    toolId: null,
    userState: [],
  };

  render() {
    const { topic, toolId, userState } = this.state;
    return (
      <div>
        <Row className='mt-4 mb-3'>
          <Col xs={12} md={12}>
            <DiscourseAddPost topicLink={topic && topic.link} toolId={toolId} userState={userState} />
          </Col>
        </Row>
        {topic && topic.posts && topic.posts.length ? (
          <div className='Rectangle'>
            { topic.posts.map((post, index) => 
            <div>
              <DiscoursePost key={post.id} post={post} />
              { index < topic.posts.length -1  && <hr className='discousion-comments-separator' />}
            </div>
              ) }
          </div>
        ) : (
          <NotFound word='comments' />
        )}
      </div>
    );
  }
}

export default DiscourseTopic;
