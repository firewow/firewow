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
class RulesActions {

    /**
     * Flush
     */
    flush(rules) {
        axios.post("/rules/flush", rules).then((response) => {
            this.actions.fetchSuccess(response.data);
        }, (error) => {
            this.actions.fetchFailed(error);
        });
        this.dispatch();
    }

    /**
     * Flush success
     */
    flushSuccess(rules) {
        this.dispatch(rules);
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
        axios.get("/rules/fetch").then((response) => {
            this.actions.fetchSuccess(response.data);
        }, (error) => {
            this.actions.fetchFailed(error);
        });
        this.dispatch();
    }

    /**
     * Rules fetch success
     */
    fetchSuccess(rules) {
        this.dispatch(rules);
    }

    /**
     * Rules fetch failed
     */
    fetchFailed(error) {
        this.dispatch(error);
    }

}

/**
 * Store
 */
@Store()
class RulesStore {

    /**
     * Constructor
     */
    constructor() {
        this.rules = [];
        this.error = null;
    }

    /**
     * Update store after fetch
     */
    @Handles(RulesActions.fetchSuccess)
    handleFetchSuccess(rules) {
        this.rules = rules;
        this.error = null;
    }
    /**
     * Update store after fetch
     */
    @Handles(RulesActions.fetchFailed)
    handleFetchFailed(error) {
        this.error = error;
    }
}

/**
 * Export
 */
export {
    RulesActions,
    RulesStore
};
