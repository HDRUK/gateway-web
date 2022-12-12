import React, { Component, Fragment } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import DiscoursePost from './DiscoursePost';
import DiscourseAddPost from './DiscourseAddPost';
import MessageNotFound from '../commonComponents/MessageNotFound';
import styles from './Discourse.module.scss';
import axios from 'axios';
import { baseURL } from '../../configs/url.config';

class DiscourseTopic extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            topicId: props.topicId,
            userState: props.userState,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        let { topicId } = this.props;
        // 1. If this entity has a related Discourse topic, get it
        if (topicId) this.getTopic(topicId);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getTopic(topicId) {
        let topicEndpoint = '';
        // 1. Determine if the current user is logged in
        if (this.state.userState[0].loggedIn) {
            // 2a. Get topic details in the context of the user
            topicEndpoint = `${baseURL}/api/v1/discourse/user/topic/${topicId}`;
        } else {
            // 2b. Get the topic in public context
            topicEndpoint = `${baseURL}/api/v1/discourse/topic/${topicId}`;
        }
        // 3. Call endpoint to retrieve topic
        axios
            .get(topicEndpoint)
            .then(res => {
                const {
                    data: { topic },
                } = res;
                // 4. Store topic result in state
                if (this._isMounted) {
                    this.setState({
                        topic,
                    });
                }
                // 5. Update discussion counter in tab
                const postCount = topic.posts.length || 0;
                this.props.onUpdateDiscoursePostCount(postCount);
            })
            .catch(err => {
                console.error(err.message);
            });
    }

    clickNewComment = async () => {
        // 1. Show create post
        this.setState({ showCreatePost: true });
    };

    submitPost = async values => {
        // If postId is a valid number, we are in edit mode
        const comment = values.comment.trim();

        if (values.postId) {
            // 1. Assemble payload to edit existing post
            let payload = {
                id: values.postId,
                comment,
            };
            // 2. Call endpoint to update existing post
            axios
                .put(`${baseURL}/api/v1/discourse/user/posts/${values.postId}`, payload)
                .then(res => {
                    const {
                        data: { topic },
                    } = res;
                    // 3. Update state to contain edited post returned to read only mode
                    this.setState({
                        topic,
                    });
                })
                .catch(err => {
                    console.error(err.message);
                });
        } else {
            // 1. Assemble payload to create new post
            let { topicId, toolId, collectionId } = this.props;
            let payload = {
                toolId,
                collectionId,
                topicId,
                comment,
            };
            // 2. Call endpoint to create new post
            axios
                .post(`${baseURL}/api/v1/discourse/user/posts`, payload)
                .then(res => {
                    const {
                        data: { topic },
                    } = res;
                    // 3. Update state to contain new post and hide creation mode
                    this.setState({
                        topic,
                        showCreatePost: false,
                    });

                    // 4. Increment discussion counter
                    this.props.onUpdateDiscoursePostCount(topic.posts.length, comment);
                })
                .catch(err => {
                    console.error(err.message);
                });
        }
    };

    postEdit = postId => {
        // 1. Set the corresponding post to edit mode
        if (postId) {
            this.setPostMode(postId, 'edit');
        }
    };

    postDelete = postId => {
        // 1. Call endpoint to delete post
        axios
            .delete(`${baseURL}/api/v1/discourse/user/posts/${postId}`)
            .then(() => {
                // 2. On successful response, remove post from state and hide modal
                let topic = this.state.topic;
                let posts = [...topic.posts];
                posts = posts.filter(function (post) {
                    return post.id !== postId;
                });
                topic.posts = posts;
                this.setState({
                    topic,
                    showDeleteModal: false,
                    deletePostId: 0,
                });
                // 3. Update discussion counter
                this.props.onUpdateDiscoursePostCount(posts.length);
            })
            .catch(err => {
                console.error(err.message);
                this.showDeleteModal(false);
            });
    };

    postCancel = postId => {
        // 1. If there is no post id, we need to hide the create post
        // otherwise, return the related post to read mode
        if (!postId) {
            this.setState({
                showCreatePost: false,
                comment: '',
            });
        } else {
            this.setPostMode(postId, 'read');
        }
    };

    setPostMode = (postId, mode) => {
        // 1. Pull the topic from state
        let topic = this.state.topic;
        // 2. Create new array of posts to avoid mutating original
        let posts = [...topic.posts];
        // 3. Find the post to update mode
        let post = posts.find(p => p.id === postId);
        // 4. If the post is found, update the mode
        if (post) {
            post.mode = mode;
        }
        // 5. Reconstruct the topic with the modified posts array
        topic.posts = [...posts];
        // 6. Update state to re-render post in correct mode
        this.setState({ topic });
    };

    showDeleteModal = (show, postId) => {
        // 1. Check if a postId to be deleted has been passed
        let deletePostId = 0;
        if (postId) {
            deletePostId = postId;
        }
        // 2. Update state to reflect modal visibility
        this.setState({
            showDeleteModal: show,
            deletePostId,
        });
    };

    // Default state
    state = {
        topicId: 0,
        topic: {},
        userState: [],
        showCreatePost: false,
        showDeleteModal: false,
        deletePostId: 0,
        comment: '',
    };

    render() {
        const { topic, userState, showCreatePost, showDeleteModal, deletePostId } = this.state;
        return (
            <Fragment>
                <div className='margin-top-16'>
                    <DiscourseAddPost userState={userState} onClickNewComment={this.clickNewComment} />
                    {showCreatePost ? (
                        <DiscoursePost mode={'create'} onPostCancel={this.postCancel} onPostSubmit={this.submitPost} />
                    ) : null}
                </div>
                {topic && topic.posts && topic.posts.length ? (
                    <div className={styles.rectangle}>
                        {topic.posts.map((post, index) => (
                            <DiscoursePost
                                key={post.id}
                                post={post}
                                mode={post.mode}
                                onPostCancel={this.postCancel}
                                onPostEdit={this.postEdit}
                                onPostDelete={e => {
                                    this.showDeleteModal(true, e);
                                }}
                                onPostSubmit={this.submitPost}
                                userState={userState}
                            />
                        ))}
                    </div>
                ) : (
                    <Row className='margin-top-16'>
                        <Col>
                            <MessageNotFound text='Nothing yet.  Add a comment to start the discussion.' />
                        </Col>
                    </Row>
                )}

                <Modal
                    show={showDeleteModal}
                    onHide={() => {
                        this.showDeleteModal(false);
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete this post?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>This post will be deleted from the Gateway and Discourse.</Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                this.showDeleteModal(false);
                            }}
                        >
                            No, nevermind
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => {
                                this.postDelete(deletePostId);
                            }}
                        >
                            Yes, delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default DiscourseTopic;
