import React from 'react';
import { Image } from 'react-bootstrap';
import Moment from 'react-moment';
import styles from './Discourse.module.scss';
import { Fragment } from 'react';
import { Formik } from 'formik';
import editIcon from '../../images/edit.svg';
import deleteIcon from '../../images/delete.svg';
import TextareaAutosize from 'react-textarea-autosize';

class DiscoursePost extends React.Component {
	readPost() {
		let { post, userState, onPostEdit, onPostDelete } = this.props;
		return (
			<div className={styles.postContents}>
				<div className={styles.postLeftCol}>
					<Image src={post.avatar_template} roundedCircle={true} />
				</div>
				<div className={styles.postRightCol}>
					<div className={styles.postDetails}>
						<div className={styles.postUsername}>
							<span>{post.username}</span>
						</div>
						<div className={styles.postDate}>
							<span>
								<Moment format='DD MMM YYYY HH:mm'>{post.created_at}</Moment>
							</span>
						</div>
					</div>
					<div className={styles.postComment} dangerouslySetInnerHTML={{ __html: post.cooked }} />
					{post.can_edit && userState[0].loggedIn ? (
						<div className={styles.buttonFooter}>
							<img alt='edit' src={editIcon} className={styles.iconButton} onClick={() => onPostEdit(post.id)} />
							<img alt='delete' src={deleteIcon} className={styles.iconButton} onClick={() => onPostDelete(post.id)} />
						</div>
					) : null}
				</div>
			</div>
		);
	}

	formContent(mode) {
		let { post, onPostSubmit, onPostCancel } = this.props;
		// 1. Default form mode to create
		let postId = 0;
		let comment = '';
		let title = 'Your comment';
		let subtitle = '';
		let submitText = 'Add this comment';
		// 2. If in edit mode, get current content from props and send edit handler
		if (mode === 'edit') {
			postId = post.id;
			comment = post.cooked.replace(/(<([^>]+)>)/gi, '');
			title = 'Edit your comment';
			subtitle = 'Do you have a question or concern?  What would you like other users to know?';
			submitText = 'Save changes';
		}
		// 3. Return form in correct mode
		return (
			<div className={styles.newPostContainer}>
				<Formik
					initialValues={{ postId, comment }}
					validate={values => {
						const errors = {};
						if (!values.comment || values.comment.length < 20) {
							errors.comment = 'You must enter a comment with at least 20 characters';
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						onPostSubmit(values);
						setSubmitting(true);
					}}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
						<form onSubmit={handleSubmit}>
							<span className='form-input-label'>{title}</span>
							<span className='form-input-label-desc'>{subtitle}</span>
							<TextareaAutosize 
								id='txtComment'
								name='comment'
								className={`${styles.txtComment} ${errors.comment && touched.comment ? styles.inputError : 'textarea-discourse'} form-input textarea-discourse`}
								data-testid='txtComment'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.comment}
							/>
							<div className={styles.validationMessage}>
								<span className='errorMessages'>{errors.comment && touched.comment && errors.comment}</span>
							</div>
							<div className={styles.buttonFooter}>
								<button className='button-tertiary' type='button' onClick={() => onPostCancel(postId)}>
									Cancel
								</button>
								<button className='button-primary' type='submit' disabled={isSubmitting}>
									{submitText}
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		);
	}

	renderSwitch(mode) {
		// Switch the content of the component based on mode
		// e.g. read, edit or create
		if (mode === 'read') {
			return this.readPost();
		} else {
			return this.formContent(mode);
		}
	}

	render() {
		const { mode } = this.props;
		return <Fragment>{this.renderSwitch(mode)}</Fragment>;
	}
}

export default DiscoursePost;
