import React, { Component, Fragment } from 'react';
import styles from './Discourse.module.scss';

class DiscourseAddPost extends Component {
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        userState: [],
    };

    render() {
        const { userState } = this.state;
        const showLoginModal = props => {
            var modalID = 'myModal';
            if (props.isRequest) {
                modalID = 'myModalRequest';
            }
            document.getElementById(modalID).style.display = 'block';
            window.onclick = function (event) {
                if (event.target === document.getElementById(modalID)) {
                    document.getElementById(modalID).style.display = 'none';
                }
            };
        };

        return (
            <Fragment>
                <button
                    type='button'
                    className={`button-tertiary ${styles.buttonAddComment}`}
                    variant='light'
                    onClick={userState[0].loggedIn === true ? this.props.onClickNewComment : showLoginModal}
                >
                    + Add a comment
                </button>
            </Fragment>
        );
    }
}

export default DiscourseAddPost;
