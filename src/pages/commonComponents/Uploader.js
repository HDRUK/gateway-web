import React from 'react';
import { Fragment } from 'react';
import { ReactComponent as PersonPlaceholderSvg } from '../../images/person-placeholder.svg';
import './CommonComponents.scss';

const Uploader = props => {
    const { uploader } = props;
    return (
        <Fragment>
            <div className='mb-1 mr-2 uploader-container'>
                <a href={'/person/' + uploader.id}>
                    <span className='uploader-chip'>
                        <PersonPlaceholderSvg className='uploader-avatar' />
                        <div data-test-id={`uploader-${uploader.id}`}>
                            {uploader.firstname} {uploader.lastname}
                        </div>
                    </span>
                </a>
            </div>
        </Fragment>
    );
};

export default Uploader;
