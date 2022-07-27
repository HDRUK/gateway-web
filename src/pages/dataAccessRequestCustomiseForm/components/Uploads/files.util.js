import _ from 'lodash';

export const fileStatus = {
	UPLOADED: 'UPLOADED',
	SCANNED: 'SCANNED',
	ERROR: 'ERROR',
	NEWFILE: 'NEWFILE',
	QUARANTINED: 'QUARANTINED'
};

export const concatFileName = file => {
	let { name = '' } = file;
	if (!_.isEmpty(name)) {
		const fileType = name.substring(name.lastIndexOf('.') + 1, name.length);
		if (name.length > 25) {
			return `${name.substring(0, 22)}...${fileType}`;
		}
		return name;
	}
	return '';
};

export const readableFileSize = file => {
	if (!_.isEmpty(file)) {
		let { size = 0 } = file;
		const k = 1024;
		const sizes = ['Bytes', 'kB', 'MB'];
		// convert to base and round down.
		const base = Math.floor(Math.log(size) / Math.log(k));
		return `${parseFloat((size / Math.pow(k, base)).toFixed(2))}  ${sizes[base]}`;
	}
	return '';
};
