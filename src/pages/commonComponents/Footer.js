import React from 'react';
import Loading from './Loading'

import { axiosCMS } from '../../utils/axios.util';

class Footer extends React.Component {
    
    state = {
        footer: '',
        isLoading: true
    };


    async componentDidMount() {
        axiosCMS
            .get('/footer', { withCredentials: false })
            .then((res) => {
                this.setState({
                    footer: res.data,
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                });
            })
    }

    render() {
        const { isLoading, footer } = this.state;

        if (isLoading) {
            return (
                <Loading />
            );
        }

        return (
            <>
                {footer !== '' ? 
                    <div dangerouslySetInnerHTML={{__html:footer}} />
                    : <div className="footerBottom" />
                }
            </>
        );
    }
}

export default Footer;
