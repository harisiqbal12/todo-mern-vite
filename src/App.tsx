import { lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth, Protected, Home } from './components';

const SnackBar = lazy(() => import('./components/Snackbar'));
const Modal = lazy(() => import('./components/Modal'));

const AppRouter = (): JSX.Element => {
	return (
		<Router>
			<Switch>
				<Route exact path='/login' component={Auth} />
				<Route exact path='/register' component={Auth} />
				<Protected exact path='/'>
					<Home />
				</Protected>
			</Switch>
			<SnackBar />
			<Modal />
		</Router>
	);
};

export default AppRouter;
