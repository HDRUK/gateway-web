import React, { Fragment } from 'react';

const FieldRepeaterAction = ({ data, manager, notificationType, index, handleRemoveClick, handleAddClick }) => {
    return (
        <>
            {manager && (
                <div className='field-action' key={`field-action-${index}`}>
                    <button
                        onClick={e => handleRemoveClick(index, notificationType)}
                        className='plusMinusButton'
                        disabled={data.length === 1}
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleAddClick(notificationType)}
                        className='plusMinusButton'
                        disabled={data.length - 1 !== index}
                    >
                        +
                    </button>
                </div>
            )}
        </>
    );
};

export default FieldRepeaterAction;
