/**
 * Materialize
 */
import 'jquery-ui/jquery-ui.js';
import 'materialize-css/bin/materialize.css';
import 'materialize-css/bin/materialize.js';


/**
 * Styles
 */
import 'styles/main.scss';

/**
 * React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history'
import routes from './routes';
import appHistory from 'apphistory'

/**
 * Render
 */
if (typeof document !== 'undefined' && window) {
	window.onload = () => {
		ReactDOM.render(
			<Router history={appHistory}>
				{routes}
			</Router>
		, document.getElementById('root'));
	};
}

if (module.hot) {
	module.hot.accept();
}
