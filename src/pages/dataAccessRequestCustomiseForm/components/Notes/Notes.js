import React, { Fragment, useState, useEffect, useRef } from 'react';
import isEmpty from 'lodash';
import '../Messages/Messages.scss';
import SVGIcon from '../../../../images/SVGIcon';
import axios from 'axios';
import Loading from '../../../commonComponents/Loading';
import { baseURL } from '../../../../configs/url.config';

const Notes = ({ applicationId, settings, userState, userType, updateCount }) => {
	const [currentNote, setCurrentNote] = useState('');
	const [notesThread, setNotesThread] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const noteType = userType.toUpperCase() === 'APPLICANT' ? 'DAR_Notes_Applicant' : 'DAR_Notes_Custodian';
	const notesEndRef = useRef(null);
	let btnRef = useRef();

	useEffect(() => {
		setIsLoading(true);
		retrieveNotesThread();
	}, [settings]);

	useEffect(() => {
		scrollToBottom();
	}, [notesThread]);

	const scrollToBottom = () => {
		notesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
	};

	const handleSendNote = note => {
		if (!note) {
			return;
		}
		addNote();
	};

	const addNote = async () => {
		if (btnRef.current) {
			btnRef.current.setAttribute('disabled', 'disabled');
		}
		// TODO: Post message to API
		const { questionId, questionSetId } = settings;
		await axios.post(`${baseURL}/api/v1/data-access-request/${applicationId}/messages`, {
			questionId,
			messageType: noteType,
			messageBody: currentNote,
		});
		setNotesThread([...notesThread, { name: userState[0].name, date: '01/01/2021', content: currentNote, userType: userType }]);
		setCurrentNote('');
		if (btnRef.current) {
			btnRef.current.removeAttribute('disabled');
		}
		updateCount(questionId, questionSetId, 'note');
	};

	const retrieveNotesThread = async () => {
		const { questionId } = settings;
		const response = await axios.get(
			`${baseURL}/api/v1/data-access-request/${applicationId}/messages?messageType=${noteType}&questionId=${questionId}`
		);
		setIsLoading(false);
		setNotesThread(response.data.messages);
	};

	const buildNotesThread = () => {
		if (isEmpty(notesThread) && notesThread.length < 1) {
			return (
				<Fragment>
					<div className='info-msg no-messages'>
						{userType.toUpperCase() === 'APPLICANT'
							? 'Use notes to organise your thoughts and share ideas with your collaborators before sending the application.'
							: 'Use notes to organise your thoughts and share ideas with other reviewers during the review process.'}
						<br />
						<br />
						There are no notes relating to this question.
					</div>
				</Fragment>
			);
		} else {
			// Map over messages and return each as a bubble styled depending on who sent it
			return notesThread.map(note => {
				return (
					<div className='message-sent'>
						<div className='notes-bubble-sent message-bubble'>
							<div className='message-metadata'>
								<span>{note.name}</span>
								<span>{note.date}</span>
							</div>
							{note.content}
						</div>
					</div>
				);
			});
		}
	};

	const getInfoMessage = () => {
		let message = 'Applicants cannot see your notes, reviewers can.';
		if (userType.toUpperCase() === 'APPLICANT') {
			message = 'Data custodians cannot see your notes, collaborators can.';
		}
		return (
			<div className='info-note'>
				<SVGIcon name='eyeCrossed' width={16} height={16} fill={'#53575a'} className={'margin-right-8'} />
				{message}
			</div>
		);
	};

	return (
		<Fragment>
			{getInfoMessage()}
			<div className='darTab-notes'>
				<div className='messages'>
					{isLoading ? (
						<Fragment>
							<Loading />
						</Fragment>
					) : (
						buildNotesThread()
					)}
					<div ref={notesEndRef} id='messageEndRef'></div>
				</div>
			</div>
			<form
				className='messages-form'
				onSubmit={e => {
					e.preventDefault();
					handleSendNote(currentNote);
				}}>
				<div className='messages-textarea'>
					<textarea
						className='form-control messages-textarea2'
						type='text'
						value={currentNote}
						name='name'
						onChange={e => {
							e.preventDefault();
							setCurrentNote(e.target.value);
						}}
					/>
				</div>
				<button ref={btnRef} className='button-secondary messages-button' type='submit'>
					Add
				</button>
			</form>
		</Fragment>
	);
};

export default Notes;
