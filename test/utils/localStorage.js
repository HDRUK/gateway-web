const setLocalStorage = (id, data) => {
    window.localStorage.setItem(id, JSON.stringify(data));
};
const getLocalStorage = id => {
    window.localStorage.getItem(id);
};

const resetLocalStorage = () => {
    window.localStorage.clear();
};

export { getLocalStorage, setLocalStorage, resetLocalStorage };
