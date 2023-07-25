import { lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth, Protected, Home } from './components';

const Modal = lazy(() => import('./components/Modal'));

const AppRouter = (): JSX.Element => {
	return (
		<Router>
			<Switch>
				<Route exact path='/login' component={Auth} />
				<Protected exact path='/'>
					<Home />
				</Protected>
			</Switch>
			<Modal />
		</Router>
	);
};

export default AppRouter;
