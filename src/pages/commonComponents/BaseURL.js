var thisBaseURL = window.location.toString();

module.exports = {
	getURL: function () {
		if (thisBaseURL.includes('appspot.com')) {
			return window.location.origin;
		} else if (!thisBaseURL.includes('localhost')) {
			var rx = /^([http|https]+:\/\/[a-z]+)([^/]*)/;
			var arr = rx.exec(thisBaseURL);
			if (arr && arr.length > 0) {
				//add -api to the sub domain for API requests
				return 'https://api' + arr[2];
			}
			return 'http://localhost:3001';
		} else {
			return 'http://localhost:3001';
		}
	},

	getCMSURL: function () {
		if (thisBaseURL.includes('appspot.com')) {
			return window.location.origin;
		} else if (!thisBaseURL.includes('localhost')) {
			var rx = /^([http|https]+:\/\/[a-z]+)\.([^/]*)/;
			var arr = rx.exec(thisBaseURL);
			if (arr && arr.length > 0) {
				//add -api to the sub domain for API requests
				return 'https://' + arr[2];
			}

			return 'http://localhost:3001';
		} else {
			return 'http://localhost:3001';
		}
	},

	getURLEnv: function () {
		if (thisBaseURL.includes('localhost')) {
			return 'local';
		}

		const rx = /^([http|https]+:\/\/[a-z]+)\.([^.]*)/;
		const url = rx.exec(thisBaseURL);

		if (url) {
			if (url.length <= 0) {
				return 'local';
			}

			const env = url[2];
			if (env === 'www') {
				return 'prod';
			} else {
				return env;
			}
		}
	},
	getDiscourseURL: function () {
		return window.location.href.includes('.www.')
			? 'https://discourse.healthdatagateway.org'
			: 'https://discourse-dev.healthresearch.tools';
	},
};
