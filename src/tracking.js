import ReactGA from 'react-ga';

var disableGA = false;

export const initGA = trackingID => {
	// Disable tracking if the opt-out cookie exists.
	var disableStr = 'ga-disable-UA-166025838-1';
	if (document.cookie.indexOf(disableStr + '=true') > -1) {
		window[disableStr] = true;
		disableGA = true;
	}
	if (disableGA === false) {
		ReactGA.initialize(trackingID);
	}
};

//'UA-166025838-1'

export const PageView = () => {
	if (disableGA === false) {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}
};

//Can also add a numerical value to an event...
export const Event = (category, action, label) => {
	if (disableGA === false) {
		ReactGA.event({
			category: category,
			action: action,
			label: label,
		});
	}
};
