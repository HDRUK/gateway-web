type GTMEvent = {
    event: string;
    [key: string]: string;
};

const useGTMEvent = () => {
    return (eventData: GTMEvent) => {
        if (typeof window !== "undefined" && window.dataLayer) {
            console.log(eventData);
            window.dataLayer.push(eventData);
        }
    };
};

export default useGTMEvent;
