import _ from 'lodash';

let showLoginPanel = (window, title, contactPoint) => {
	document.getElementById('myModal').style.display = 'block';
	document.getElementById('loginWayFinder').style.display = 'none';
	document.getElementById('loginButtons').style.display = 'block';
	document.getElementById('loginModalTitle').innerHTML = 'You must be signed in to request access';
	document.getElementById('modalRequestDetails').innerHTML = title;
	document.getElementById('modalRequestSection').style.display = 'block';

	window.onclick = function (event) {
		if (event.target === document.getElementById('myModal')) {
			document.getElementById('myModal').style.display = 'none';
		}
	};
};

export default {
	showLoginPanel: showLoginPanel,
};
