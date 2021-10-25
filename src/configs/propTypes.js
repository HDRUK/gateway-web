import _ from 'lodash';

export const omit = (propTypes, exclude) => {
	return _.omit(propTypes, exclude);
};
