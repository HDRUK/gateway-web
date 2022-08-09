import React, { Fragment, useState, useEffect, useRef } from 'react';
import isEmpty from 'lodash';
import '../Messages/Messages.scss';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import SVGIcon from '../../../../images/SVGIcon';
import Loading from '../../../commonComponents/Loading';
import { baseURL } from '../../../../configs/url.config';
import LayoutBox from '../../../../components/LayoutBox';
import Textarea from '../../../../components/Textarea/Textarea';
import Button from '../../../../components/Button';

const Notes = ({ applicationId, settings, userState, userType, updateCount, count, onLoad }) => {
    const [currentNote, setCurrentNote] = useState('');
    const [notesThread, setNotesThread] = useState([]);
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const noteType = userType.toUpperCase() === 'APPLICANT' ? 'DAR_Notes_Applicant' : 'DAR_Notes_Custodian';
    const notesEndRef = useRef(null);
    const btnRef = useRef();

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

        const { questionId, questionSetId, panel } = settings;

        await axios.post(`${baseURL}/api/v1/data-access-request/${applicationId}/messages`, {
            questionId,
            panel,
            messageType: noteType,
            messageBody: currentNote,
        });

        setNotesThread([...notesThread, { name: userState[0].name, date: '01/01/2021', content: currentNote, userType }]);
        setCurrentNote('');

        if (btnRef.current) {
            btnRef.current.removeAttribute('disabled');
        }

        updateCount(questionId, questionSetId || panel.panelId, 'note');
    };

    const retrieveNotesThread = async () => {
        const { questionId, panel } = settings;

        const response = await axios.get(
            `${baseURL}/api/v1/data-access-request/${applicationId}/messages?messageType=${noteType}&${
                questionId ? `questionId=${questionId}` : `panelId=${panel.panelId}`
            }`
        );

        onLoad(response);

        setIsLoading(false);
        setNotesThread(response.data.messages);
    };

    const buildNotesThread = () => {
        if (isEmpty(notesThread) && notesThread.length < 1) {
            return (
                <>
                    <div className='info-msg no-messages'>
                        {userType.toUpperCase() === 'APPLICANT'
                            ? 'Use notes to organise your thoughts and share ideas with your collaborators before sending the application.'
                            : 'Use notes to organise your thoughts and share ideas with other reviewers during the review process.'}
                        <br />
                        <br />
                        There are no notes relating to this question.
                    </div>
                </>
            );
        }
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
    };

    const getInfoMessage = () => {
        let message = 'Applicants cannot see your notes, reviewers can.';

        if (userType.toUpperCase() === 'APPLICANT') {
            message = 'Data custodians cannot see your notes, collaborators can.';
        }

        return (
            <div className='info-note'>
                <SVGIcon name='eyeCrossed' width={16} height={16} fill='#53575a' className='margin-right-8' />
                {message}
            </div>
        );
    };

    const handleChangeNote = ({ target: { value } }) => {
        setCurrentNote(value);
    };

    return (
        <>
            {getInfoMessage()}
            <div className='darTab-notes'>
                <div className='messages'>
                    {isLoading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        buildNotesThread()
                    )}
                    <div ref={notesEndRef} id='messageEndRef' />
                </div>
            </div>
            <LayoutBox
                p={3}
                display='flex'
                as='form'
                onSubmit={e => {
                    e.preventDefault();
                    handleSendNote(currentNote);
                }}>
                <LayoutBox flexGrow='1'>
                    <Textarea autosize value={currentNote} onChange={handleChangeNote} mb={0} width='100%' minHeight='42px' />
                </LayoutBox>
                <Button variant='secondary' type='submit' disabled={addButtonDisabled} ml={2}>
                    Send
                </Button>
            </LayoutBox>
        </>
    );
};

export default Notes;
