import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { Input, Button } from '../Utils';
import { toggleModal } from '../../store/reducers/modal.slice';
import { handleUser } from '../../store/reducers/user.slice';
import { ModalState, UserState, StoreTypes } from '../../store/reducers/types';

import type { LoginValuesProps } from './types';
import axios from 'axios';
import cookie from 'js-cookie';

export default function Login(): JSX.Element {
	const dispatch = useDispatch();

	const handleToggleModal = ({ ...props }: ModalState) => {
		console.log('im here');
		dispatch(
			toggleModal({
				...props,
			})
		);
	};

	const user: UserState = useSelector((state: StoreTypes) => state.user);

	const [values, setValues] = useState<LoginValuesProps>({
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

			const errors: { isError: boolean; message: string; fields: Array<string> } =
				{
					isError: false,
					message: '',
					fields: [],
				};

			if (!values?.email?.length) {
				// validate email
				errors.fields.push('email');
				errors.message = 'Email not define';
				errors.isError = true;
			}
			if (!values?.password?.length) {
				errors.fields.push('password');
				errors.message = 'Password not define';
				errors.isError = true;
			}

			if (errors.isError) {
				console.log(errors);

				// show modal
				handleToggleModal({
					isOpen: true,
					message: `${errors?.fields?.join(',')} - ${errors?.message}`,
					type: 'ERROR',
				});

				return;
			}

			if (
				(values?.email?.length > 0 && !values.email.includes('@')) ||
				!values.email.includes('.com')
			) {
				errors.message = 'Invalid email';
				errors.isError = true;
				errors.fields = ['email'];
			}

			if (values?.password?.length < 8) {
				errors.message = 'Password too short';
				errors.isError = true;
				errors.fields = ['password'];
			}

			if (errors.isError) {
				console.log(errors);

				// show modal
				handleToggleModal({
					isOpen: true,
					message: `${errors?.fields?.join(',')} - ${errors?.message}`,
					type: 'ERROR',
				});

				return;
			}

			setLoading(true);
			const data = await axios('/api/login', {
				method: 'POST',
				data: {
					email: values?.email,
					password: values?.password,
				},
			});

			setLoading(false);

			console.log(data);

			if (data?.data?.error) {
				handleToggleModal({
					isOpen: true,
					message: data?.data?.message,
					type: 'ERROR',
				});
				return;
			}

			dispatch(
				handleUser({
					authenticated: true,
					email: data?.data?.email,
					name: data?.data?.name,
				})
			);

			setValues({
				email: '',
				password: '',
			});
		} catch (err) {
			console.log(err);
			handleToggleModal({
				isOpen: true,
				message: 'Something went wrong',
				type: 'ERROR',
			});
			setLoading(false);
		}
	}

	console.log(user);

	if (user.authenticated === true || cookie?.get('jwt')?.length) {
		return <Redirect to='/' />;
	}

	return (
		<div className='w-full h-full flex flex-col p-20'>
			<h2 className='text-heading font-bold text-zinc-800'>Login</h2>
			<span className='-mt-2 font-semibold text-zinc-600'>
				login using email & password
			</span>
			<form
				onSubmit={onSubmit}
				className='w-[80%] flex h-full flex-col p-10 bg- justify-center gap-4'>
				<Input
					label='Email'
					placeholder='Enter your email'
					type='email'
					name='email'
					value={values?.email}
					onChange={handleChange('email')}
				/>
				<Input
					label='Password'
					placeholder='Enter your password'
					type='password'
					name='password'
					value={values?.password}
					onChange={handleChange('password')}
				/>
				<Link to='/register'>
					<span
						className='text-sx text-zinc-600 font-semibold cursor-pointer
					'>
						Don't have account?
					</span>
				</Link>
				<Button title='Login' type='submit' loading={loading} />
			</form>
		</div>
	);
}
