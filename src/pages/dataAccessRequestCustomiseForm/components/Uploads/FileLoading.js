import React from 'react';
import Image from 'react-bootstrap/Image';

const FileLoading = () => {
	return (
		<div className='loading'>
			<div className='loading-inner'>
				<Image src={require('../../../../images/Loader.gif')} />
				Loading ...
			</div>
		</div>
	);
};
export default FileLoading;
