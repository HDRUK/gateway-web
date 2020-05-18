import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

var baseURL = require('./BaseURL').getURL();

class DiscourseAddPost extends Component {
  constructor(props) {
    super(props);
    this.state.topicLink = props.topicLink;
    this.state.userState = props.userState;
    this.state.toolId = props.toolId;
  }

  // initialize our state
  state = {
    userState: [],
    topicLink: null,
    toolId: null
  };
  
  createTopicAndRedirecToDiscourse = async (toolId) => {
  
    if (!toolId) {
      return;
    }
    const res = await axios.put(baseURL + `/api/v1/discourse/topic/tool/${toolId}`);
    this.setState({ topicLink: res.data.data.link });
    window.open(res.data.data.link);
  }

  render() {
    const { topicLink, toolId, userState } = this.state;

    const showLoginModal = (props) => {
      var modalID="myModal"
      if (props.isRequest) {
          modalID="myModalRequest";
      }
      document.getElementById(modalID).style.display = "block";
      
      window.onclick = function (event) {
          if (event.target === document.getElementById(modalID)) {
              document.getElementById(modalID).style.display = "none";
          }
      }
    };

    return userState[0].loggedIn === true ? (
      <Button variant='light' id='discourse-add-comment' className='mb-1' onClick={() => {
        topicLink ? window.open(topicLink) : this.createTopicAndRedirecToDiscourse(toolId)
      }}>
        + Add a comment
      </Button>
    ) : (
      <Button variant='light' id='discourse-add-comment' className='mb-1' onClick={showLoginModal}>
        + Add a comment
      </Button>
    );
  }
}


export default DiscourseAddPost;
