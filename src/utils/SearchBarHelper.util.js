/**
 * [doSearch]
 * @desc - Injected from props, parent function callout
 */
const doSearch = (e, component) => {
    // fires on enter on searchbar
    if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(component.state.searchString)}`;
};

const updateSearchString = (searchString, component) => {
    component.setState({ searchString });
};

export { doSearch, updateSearchString };
