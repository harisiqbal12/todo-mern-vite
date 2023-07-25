import { ChangeEvent, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import cookie from 'js-cookie';

import { Input, Button } from '../Utils';
import { StoreTypes, UserState } from '../../store/reducers/types';
import { toggleModal } from '../../store/reducers/modal.slice';
import { handleUser } from '../../store/reducers/user.slice';

export default function Register(): JSX.Element {
	const dispatch = useDispatch();
	const user: UserState = useSelector((state: StoreTypes) => state.user);

	const [values, setValues] = useState<{
		name: string;
		email: string;
		password: string;
	}>({
		name: '',
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	const handleChange = (type: string) => (e: ChangeEvent<HTMLInputElement>) => {
		setValues(prev => ({ ...prev, [type]: e.target.value }));
	};

	async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
		try {
			e.preventDefault();
			const missingFields: Array<string> = [];
			let isError: boolean = false;

			if (!values?.email) {
				missingFields.push('email');
				isError = true;
			}

			if (!values?.name) {
				missingFields.push('name');
				isError = true;
			}

			if (!values?.password) {
				missingFields.push('password');
				isError = true;
			}

			if (isError) {
				dispatch(
					toggleModal({
						isOpen: true,
						message: `${missingFields?.join(',')} missing fields`,
						type: 'ERROR',
					})
				);

				return;
			}

			if (!values?.email?.includes('@') || !values?.email?.includes('.com')) {
				dispatch(
					toggleModal({
						isOpen: true,
						message: `Invalid email`,
						type: 'ERROR',
					})
				);

				return;
			}

			if (values?.password?.length < 8) {
				dispatch(
					toggleModal({
						isOpen: true,
						message: `Password too short`,
						type: 'ERROR',
					})
				);

				return;
			}

			setLoading(true);
			const response = await axios('/api/signup', {
				method: 'POST',
				data: {
					email: values?.email,
					password: values?.password,
					name: values?.name,
				},
			});
			setLoading(false);

			if (response.data?.error) {
				dispatch(
					toggleModal({
						isOpen: true,
						message: response?.data?.message,
						type: 'ERROR',
					})
				);

				return;
			}

			dispatch(
				handleUser({
					authenticated: true,
					email: response?.data?.email,
					name: response?.data?.name,
				})
			);

			setValues({
				email: '',
				password: '',
				name: '',
			});
		} catch (err) {
			setLoading(false);

			dispatch(
				toggleModal({
					isOpen: true,
					message: 'Something went wrong',
					type: 'ERROR',
				})
			);
		}
	}

	if (user.authenticated === true || cookie.get('jwt')?.length) {
		return <Redirect to='/' />;
	}

	return (
		<div className='w-full h-full flex flex-col p-20'>
			<h2 className='text-heading font-bold text-zinc-800'>Register</h2>
			<span className='-mt-2 font-semibold text-zinc-600'>Register with us</span>
			<form
				onSubmit={onSubmit}
				className='w-[80%] flex h-full flex-col p-10 bg- justify-center gap-4'>
				<Input
					label='Name'
					placeholder='Enter your name'
					type='text'
					name='name'
					title='Enter your name'
					value={values.name}
					onChange={handleChange('name')}
				/>
				<Input
					label='Email'
					placeholder='Enter your email'
					type='email'
					name='email'
					title='Enter your email'
					value={values.email}
					onChange={handleChange('email')}
				/>
				<Input
					label='Password'
					placeholder='Enter your password'
					type='password'
					name='password'
					title='Enter password'
					value={values.password}
					onChange={handleChange('password')}
				/>
				<Link to='/login'>
					<span
						className='text-sx text-zinc-600 font-semibold cursor-pointer
          '>
						Already have an account?
					</span>
				</Link>
				<Button title='Login' type='submit' loading={loading} />
			</form>
		</div>
	);
}
