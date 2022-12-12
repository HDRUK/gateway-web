import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import './CommonComponents.scss';

const baseURL = require('./BaseURL');
const cmsURL = baseURL.getCMSURL();
const env = baseURL.getURLEnv();
const local = 'local';

class Footer extends React.Component {
    state = {
        footer: '',
        isLoading: true,
    };

    async componentDidMount() {
        let url = env === local ? 'https://uatbeta.healthdatagateway.org' : cmsURL;
        axios
            .get(url + '/footer', { withCredentials: false })
            .then(res => {
                this.setState({
                    footer: res.data,
                    isLoading: false,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
            });
    }

    render() {
        const { isLoading, footer } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        return <>{footer !== '' ? <div dangerouslySetInnerHTML={{ __html: footer }} /> : <div className='footerBottom' />}</>;
    }
}

export default Footer;
