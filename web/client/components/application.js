/**
 * Imports
 */
import axios from 'axios'
import Login from 'components/pages/login'
import { SessionActions, SessionStore } from 'data/session'

/**
 * Class
 */
export default class Application extends React.Component {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: 0,
            authenticated: false
        };
    }

    /**
     * Check status
     */
    componentDidMount() {
        SessionActions.validate();
    }

    /**
     * Mount
     */
    componentWillMount() {
        this.hookInterceptors();
        SessionStore.listen(this.handleSessionUpdate);
    }

    /**
     * Unmount
     */
    componentWillUnmount() {
        SessionStore.unlisten(this.handleSessionUpdate);
        this.unhookInterceptors();
    }

    /**
     * Handles session updates
     */
    handleSessionUpdate = () => {
        this.setState({
            authenticated: !!SessionStore.getState().session
        });
    }

    /**
     * Interceptor hooks
     */
    hookInterceptors() {
        this.requestInterceptor = axios.interceptors.request.use((config) => {
            var state = SessionStore.getState();
            if (state.session) {
                if (state.session.token) {
                    config.headers.Token = state.session.token;
                }
            }
            this.setState({ loading: this.state.loading + 1 });
            return config;
        }, (error) => {
            this.setState({ loading: this.state.loading - 1 });
            return Promise.reject(error);
        });
        this.responseInterceptor = axios.interceptors.response.use((response) => {
            this.setState({ loading: this.state.loading - 1 });
            if (response.status == 403) {
                SessionActions.expire();
            }
            return response;
        }, (error) => {
            this.setState({ loading: this.state.loading - 1 });
            return Promise.reject(error);
        });
    }

    /**
     * Interceptor hooks
     */
    unhookInterceptors() {
        axios.interceptors.request.eject(this.requestInterceptor);
        axios.interceptors.response.eject(this.responseInterceptor);
    }
    /**
     * Render
     */
    render() {
        if (!this.state.authenticated) {
            return (
                <Login />
            );
        }

        return (
            <div className="app">
                {this.props.children}
            </div>
        );
    }
}
