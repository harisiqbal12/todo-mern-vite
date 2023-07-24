import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'js-cookie';

import { UserState, StoreTypes } from '../store/reducers/types';
import { handleUser } from '../store/reducers/user.slice';
import { useCookies } from 'react-cookie';

export default function Protected({ path, exact, children }: Props): JSX.Element {
	const dispatch = useDispatch();
	const [cook] = useCookies(['jwt']);

	const userStates: UserState = useSelector((state: StoreTypes) => state.user);

	console.log(userStates);

	useEffect(() => {
		console.log("cook")
		console.log(cook);
		const jwt = cookies.get('jwt');
		cookies.get('');
		console.log('frontend cookie');
		console.log(jwt);
		if (!jwt?.length) {
			console.log('not logged in');
			dispatch(
				handleUser({
					authenticated: false,
					email: null,
					name: null,
				})
			);
			return;
		}
	}, []);

	if (userStates?.authenticated === null) {
		return <h2>Loading</h2>;
	}

	if (userStates?.authenticated === false) {
		return <Redirect to='/login' />;
	}

	return (
		<Route path={path} exact={exact}>
			{children}
		</Route>
	);
}

interface Props {
	path: string;
	exact: boolean;
	children: JSX.Element;
}
