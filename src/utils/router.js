export const isRouteMatch = path => {
    const regEx = new RegExp(`^${path}`, 'i');
    return regEx.test(window.location.pathname);
};
