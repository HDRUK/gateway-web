/**
 * [doSearch]
 * @desc - Injected from props, parent function callout
 */
let doSearch = (e, component) => {
	//fires on enter on searchbar
	if (e.key === 'Enter') window.location.href = '/search?search=' + component.state.searchString;
};

let updateSearchString = (searchString, component) => {
	component.setState({ searchString: searchString });
};

export default {
	doSearch: doSearch,
	updateSearchString: updateSearchString,
};
