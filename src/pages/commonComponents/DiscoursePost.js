import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import Moment from 'react-moment';

class DiscoursePost extends React.Component {
  constructor(props) {
    super(props);
    this.state.post = props.post;
  }

  // initialize our state
  state = {
    post: null,
  };

  render() {
    const { post } = this.state;
    return (
      <Row className='mt-2'>
        <Col md={1} className='text-center'>
          {' '}
          <Image src={post.avatar_template} roundedCircle={true} />
        </Col>
        <Col md={11}>
          <Row className='mb-2'>
            <Col md={8}>
              <span className='discousion-username'>{post.username}</span>
            </Col>
            <Col md={4} className='text-right'>
              <span className='discousion-date'><Moment format="MMM 'YY">{post.created_at}</Moment></span>
            </Col>
          </Row>
          <Row>
            <div className='ml-3 mr-4 Gray800-15px' dangerouslySetInnerHTML={{ __html: post.cooked }} />
          </Row>
        </Col>
      </Row>
    );
  }
}

export default DiscoursePost;
