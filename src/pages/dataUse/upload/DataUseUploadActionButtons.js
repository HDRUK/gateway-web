import React from 'react';

const DataUseUploadActionButtons = ({ dataUseUpload }) => {
	return (
		<>
			<button className='button-secondary' onClick={() => dataUseUpload.current.toggleSubmitModal()}>
				Submit data uses
			</button>
		</>
	);
};

export default DataUseUploadActionButtons;
