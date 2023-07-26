/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'js-cookie';

import { UserState, StoreTypes } from '../store/reducers/types';
import { handleUser } from '../store/reducers/user.slice';
import axios from 'axios';

export default function Protected({ path, exact, children }: Props): JSX.Element {
	const dispatch = useDispatch();

	const userStates: UserState = useSelector((state: StoreTypes) => state.user);

	useEffect(() => {
		const token: any = cookies.get('jwt');

		if (!token?.length) {
			dispatch(
				handleUser({
					authenticated: false,
					email: null,
					name: null,
				})
			);
			return;
		}

		(async () => {
			try {
				const response = await axios('/api/verify', {
					method: 'POST',
					data: {
						token: token,
					},
				});

				if (response?.data?.error) {
					cookies.remove('jwt');

					return;
				}

				dispatch(
					handleUser({
						authenticated: true,
						email: response?.data?.user?.email,
						name: response?.data?.user?.name,
					})
				);
			} catch (err) {
				// error occured
			}
		})();
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
