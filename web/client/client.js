import 'styles/main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Application from 'components/application';
import { Router, Route, IndexRoute } from 'react-router'

ReactDOM.render(
	<Router history={createHistory}>
		<Route path="/" component={Application}>
		</Route>
	</Router>,
	document.getElementById('root')
);
