import { Button } from 'hdruk-react-core';

const MessageFooter = ({ onSubmitMessage, onMessageChange, value }) => {
    return (
        <>
            <form
                onSubmit={e => {
                    onSubmitMessage(e);
                }}>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        type='text'
                        value={value}
                        name='name'
                        onChange={e => {
                            onMessageChange(e);
                        }}
                    />
                </div>
                <Button variant='secondary' type='submit'>
                    Submit
                </Button>
            </form>
        </>
    );
};

export default MessageFooter;
