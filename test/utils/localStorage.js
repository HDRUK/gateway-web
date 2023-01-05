const setLocalStorage = (id, data) => {
    window.localStorage.setItem(id, JSON.stringify(data));
};

const resetLocalStorage = () => {
    window.localStorage.clear();
};

export { setLocalStorage, resetLocalStorage };
