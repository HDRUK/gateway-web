import _ from 'lodash';
import removeMd from 'remove-markdown';

export const isEditMode = (url = '') => {
	if (!_.isEmpty(url)) {
		let src = url.toLowerCase();
		if (src.includes('edit')) return true;

		return false;
	}
	return false;
};

export const toTitleCase = str => {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export const isPDFLink = link => {
	return /\.pdf$/.test(link);
};

export const removeArrayItem = (arr, value) => {
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
};

export const stripMarkdown = (value = '', truncate = 0) => {
	if (!_.isEmpty(value)) {
		if (truncate > 0) {
			value = value.substr(0, 255) + (value.length > 255 ? '...' : '');
		}
		value = removeMd(value);
	}
	return value;
};
