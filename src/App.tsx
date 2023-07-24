import { lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth, Protected } from './components';

const Modal = lazy(() => import('./components/Modal'));

const AppRouter = (): JSX.Element => {
	return (
		<Router>
			<Switch>
				<Route exact path='/login' component={Auth} />
				<Protected exact path='/'>
					<h2>Protected Home page</h2>
				</Protected>
			</Switch>
			<Modal />
		</Router>
	);
};

export default AppRouter;
