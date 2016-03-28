/**
 * Materialize
 */
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

/**
 * Render
 */
if (typeof document !== 'undefined' && window) {
	window.onload = () => {
		const appHistory = useRouterHistory(createHistory)({ queryKey: false })
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
