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
class DomainsActions {

    /**
     * Flush
     */
    flush(domains) {
        axios.post("/domains/flush", domains).then((response) => {
            this.actions.fetchSuccess(response.data);
        }, (error) => {
            this.actions.fetchFailed(error);
        });
        this.dispatch();
    }

    /**
     * Flush success
     */
    flushSuccess(domains) {
        this.dispatch(domains);
    }

    /**
     * Flush failed
     */
    flushFailed(error) {
        this.dispatch(error);
    }

    /**
     * Fetch
     */
    fetch() {
        axios.get("/domains/fetch").then((response) => {
            this.actions.fetchSuccess(response.data);
        }, (error) => {
            this.actions.fetchFailed(error);
        });
        this.dispatch();
    }

    /**
     * Domains fetch success
     */
    fetchSuccess(domains) {
        this.dispatch(domains);
    }

    /**
     * Domains fetch failed
     */
    fetchFailed(error) {
        this.dispatch(error);
    }

}

/**
 * Store
 */
@Store()
class DomainsStore {

    /**
     * Constructor
     */
    constructor() {
        this.domains = [];
        this.error = null;
    }

    /**
     * Update store after fetch
     */
    @Handles(DomainsActions.fetchSuccess)
    handleFetchSuccess(domains) {
        this.domains = domains;
        this.error = null;
    }
    /**
     * Update store after fetch
     */
    @Handles(DomainsActions.fetchFailed)
    handleFetchFailed(error) {
        this.error = error;
    }
}

/**
 * Export
 */
export {
    DomainsActions,
    DomainsStore
};
