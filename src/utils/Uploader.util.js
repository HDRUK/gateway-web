import _ from 'lodash';
import serviceUsers from '../services/users/users';

/**
 * Returns array of user object.
 *
 * @param {Array} authors Array of author ids
 * @param {object} currentUser user object.
 *
 */
const buildListOfUploaders = async (authorIds, currentUser) => {
	let listOfUploaders = [{ id: currentUser.id, name: `${currentUser.name} (You)` }];
	if (authorIds && authorIds.length) {
		const uploaders = await Promise.all(
			authorIds
				.filter(id => id !== currentUser.id)
				.map(async id => {
					if (id !== currentUser.id) {
						const userInfo = await getUserInfo(id);
						if (userInfo) {
							return {
								id: userInfo.id,
								name: `${userInfo.firstname} ${userInfo.lastname}`,
							};
						}
					}
				})
		);
		listOfUploaders = [...listOfUploaders, ...uploaders];
	}
	return listOfUploaders;
};

const getUserInfo = async id => {
	const response = await serviceUsers.getUserById(id, {});
	const userInfo = response.data.person;
	return userInfo;
};

export default {
	buildListOfUploaders: buildListOfUploaders,
	getUserInfo: getUserInfo,
};
