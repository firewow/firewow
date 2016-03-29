/**
 * Imports
 */

import alt from './index'
import axios from 'axios'
import { Actions, Store, Handles } from 'utils/decorators'

/**
 * Actions
 */

@Actions()
class SessionActions {

    /**
     * Login
     */
    login(user, pass) {
        var form = {
            user: user,
            pass: pass
        };
        axios.post('/login', form).then((response) => {
            this.actions.loginSuccess(response.data);
        }).catch((error) => {
            this.actions.loginFailed(error);
        });
        this.dispatch();
    }

    /**
     * Login success
     */
    loginSuccess(response) {
        return response;
    }

    /**
     * Login failed
     */
    loginFailed(error) {
        return error;
    }
    /**
     * Logout
     */
    logout(user, pass) {
        axios.get('/logout').then((response) => {
            this.actions.logoutSuccess(response.data);
        }).catch((error) => {
            this.actions.logoutFailed(error);
        });
        this.dispatch();
    }

    /**
     * Logout success
     */
    logoutSuccess(response) {
        return response;
    }

    /**
     * Logout failed
     */
    logoutFailed(error) {
        return error;
    }

    /**
     * Session validation
     */
    validate() {
        axios.get('/validate').then((response) => {
            this.actions.validateSuccess(response.data);
        }).catch((error) => {
            this.actions.validateFailed(error);
        });
        this.dispatch();
    }

    /**
     * Validation success
     */
    validateSuccess(response) {
        return response;
    }

    /**
     * Validation failed
     */
    validateFailed(error) {
        return error;
    }
}

/**
 * Store
 */

@Store()
class SessionStore {

    /**
     * Constructor
     */
    construct() {
        this.session = false;
        this.error = false;
        this.restore();
        if (DEBUG) {
            this.dispatcher.register(console.log.bind(console));
        }
    }

    /**
     * Login handler
     */
    @Handles(SessionActions.login)
    handleLogin() {
        this.session = false;
        this.error = false;
        this.save();
    }

    /**
     * Login success handler
     */
    @Handles(SessionActions.loginSuccess)
    handleLoginSuccess(session) {
        this.session = session;
        this.error = false;
        this.save();
    }

    /**
     * Login error handler
     */
    @Handles(SessionActions.loginFailed)
    handleLoginFailed(error) {
        this.session = false;
        this.error = error;
        this.save();
    }

    /**
     * Logout handler
     */
    @Handles(SessionActions.logout)
    handleLogout() {
        this.session = false;
        this.error = false;
        this.save();
    }

    /**
     * Logout error handler
     */
    @Handles(SessionActions.logoutFailed)
    handleLogoutFailed(error) {
        this.error = error;
        this.save();
    }

    /**
     * Validation success handler
     */
    @Handles(SessionActions.validateSuccess)
    handleValidateSuccess(session) {
        this.session = session;
        this.error = false;
        this.save();
    }

    /**
     * Validation error handler
     */
    @Handles(SessionActions.validateFailed)
    handleValidateFailed(error) {
        this.session = false;
        this.error = error;
        this.save();
    }

    /**
     * Session save
     */
    save() {
        sessionStorage.session = JSON.stringify(this.session);
    }

    /**
     * Session restore
     * @return {[type]} [description]
     */
    restore() {
        if (sessionStorage.session) {
            this.data = JSON.parse(sessionStorage.session);
        }
    }
}

export {
    SessionActions,
    SessionStore
};
