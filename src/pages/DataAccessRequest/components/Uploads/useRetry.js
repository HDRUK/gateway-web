import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { baseURL } from '../../../../configs/url.config';

const useRetry = ({ maxRetries = 30, pauseDuration = 10000, onIterationComplete }) => {
    const [count, setCount] = useState(0);
    const [files, setFiles] = useState([]);

    const poll = () => {
        const fileRequests = files.map(file => axios.get(`${baseURL}/api/v1/data-access-request/1/file/1/status`));

        Promise.allSettled(fileRequests).then(values => {
            console.log('VALUES', values);
            setCount(prevCount => prevCount + 1);

            if (onIterationComplete) onIterationComplete(files, values);
        });

        // files.forEach(file => {
        //     // if (file.status === fileStatus.NEWFILE || file.status === fileStatus.UPLOADED) {
        //     //     axios
        //             .get(`${baseURL}/api/v1/data-access-request/${id}/file/${file.fileId}/status`)
        //             .then(response => {
        //                 file.status = response.data.status;
        //                 if (
        //                     file.status === fileStatus.SCANNED ||
        //                     file.status === fileStatus.QUARANTINED ||
        //                     file.status === fileStatus.ERROR
        //                 ) {
        //                     onFilesUpdate(files, false);
        //                     retryCount = 0;
        //                     clearInterval(timer);
        //                 }
        //             })
        //             .catch(err => {
        //                 console.error(err.message);
        //                 clearInterval(timer);
        //             });
        //     }
        // });
    };

    const init = list => {
        setFiles(list);
    };

    useEffect(() => {
        if (files.length > 0 && count < maxRetries) {
            setTimeout(
                () => {
                    poll(files);
                },
                !count ? 0 : pauseDuration
            );
        }
    }, [files, count]);

    useEffect(() => {
        setFiles([]);
    }, [count < maxRetries]);

    // useEffect(() => {
    //     const intervalRef = useRef();

    //     useEffect(() => {
    //         const id = setInterval(() => {
    //             // ...
    //         });
    //         intervalRef.current = id;
    //         return () => {
    //             clearInterval(intervalRef.current);
    //         };
    //     });
    // }, []);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         if (retryCount < maxRetries) {
    //             retryCount++;
    //             files.forEach(file => {
    //                 if (file.status === fileStatus.NEWFILE || file.status === fileStatus.UPLOADED) {
    //                     axios
    //                         .get(`${baseURL}/api/v1/data-access-request/${id}/file/${file.fileId}/status`)
    //                         .then(response => {
    //                             file.status = response.data.status;
    //                             if (
    //                                 file.status === fileStatus.SCANNED ||
    //                                 file.status === fileStatus.QUARANTINED ||
    //                                 file.status === fileStatus.ERROR
    //                             ) {
    //                                 onFilesUpdate(files, false);
    //                                 retryCount = 0;
    //                                 clearInterval(timer);
    //                             }
    //                         })
    //                         .catch(err => {
    //                             console.error(err.message);
    //                             clearInterval(timer);
    //                         });
    //                 }
    //             });
    //         } else {
    //             clearInterval(timer);
    //         }
    //     }, 10000);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    return {
        init,
        count,
    };
};

export default useRetry;
