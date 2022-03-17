import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';

const Guidance = ({ activeGuidance, resetGuidance }) => {
    return (
        <>
            {activeGuidance ? (
                <>
                    <header>
                        <div>
                            <i className='far fa-question-circle mr-2' />
                            <p className='gray800-14-bold'>Guidance</p>
                        </div>
                        <CloseButtonSvg width='16px' height='16px' fill='#475da' onClick={resetGuidance} />
                    </header>
                    <main className='gray800-14'>
                        <ReactMarkdown source={activeGuidance} linkTarget='_blank' />
                    </main>
                </>
            ) : (
                <div className='darTab-guidance'>
                    Click on a question guidance to view details&nbsp;
                    <span className='purple-bold-16'>
                        <i className='far fa-question-circle mr-2' />
                    </span>
                </div>
            )}
        </>
    );
};

export default Guidance;
