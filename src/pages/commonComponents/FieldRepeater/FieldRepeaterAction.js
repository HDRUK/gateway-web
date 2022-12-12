import React, { Fragment } from 'react';

const FieldRepeaterAction = ({ data, manager, notificationType, index, handleRemoveClick, handleAddClick }) => {
    return (
        <Fragment>
            {manager && (
                <div className='field-action' key={`field-action-${index}`}>
                    <button
                        onClick={e => handleRemoveClick(index, notificationType)}
                        className='plusMinusButton'
                        disabled={data.length !== 1 ? false : true}
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleAddClick(notificationType)}
                        className='plusMinusButton'
                        disabled={data.length - 1 !== index ? true : false}
                    >
                        +
                    </button>
                </div>
            )}
        </Fragment>
    );
};

export default FieldRepeaterAction;
