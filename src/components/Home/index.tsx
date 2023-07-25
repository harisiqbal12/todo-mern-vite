/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSelector, useDispatch } from 'react-redux';

import { UserState, StoreTypes, TodoState } from '../../store/reducers/types';
import { fetchTodos, addTodo } from '../../store/reducers/todo.slice';
import { toggleModal } from '../../store/reducers/modal.slice';
import { Input, Todo } from '../Utils';
import { useCallback, useEffect, ChangeEvent, useState } from 'react';
import cookie from 'js-cookie';
import { CircleSpinner } from 'react-spinners-kit';

export default function Home(): JSX.Element {
	const dispatch = useDispatch();

	const userStates: UserState = useSelector((state: StoreTypes) => state.user);
	const todos: TodoState = useSelector((state: StoreTypes) => state.todo);

	const [values, setValues] = useState({
		title: '',
		description: '',
	});

	useEffect(() => {
		const token = cookie.get('jwt');
		if (userStates.email) {
			console.log('todos fetching');
			//@ts-ignore
			dispatch(fetchTodos(token));
		}
	}, [userStates?.email]);

	const handleChange = (type: string) => (e: ChangeEvent<HTMLInputElement>) => {
		setValues(prev => ({ ...prev, [type]: e.target.value }));
	};

	const RenderTodos = useCallback((): any => {
		const array = new Array(10).fill(null);

		if (todos.loading) {
			return array.map((_, i) => (
				<div
					key={i}
					className='w-full rounded-lg shrink-0 bg-gray-200 py-2 h-14 animate-pulse'
				/>
			));
		}

		return todos.todos.map((el, i) => (
			<Todo
				title={el?.title}
				description={el?.description}
				createdAt={new Date(el?.createdAt).toDateString()}
				status={el?.status}
				key={i}
				_id={el?._id}
			/>
		));
	}, [todos.todos, todos.loading]);

	const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			if (!values?.title?.length) {
				dispatch(
					toggleModal({
						isOpen: true,
						message: 'Title is required',
						type: 'ERROR',
					})
				);
				return;
			}

			const token = cookie.get('jwt');
			//@ts-ignore
			dispatch(addTodo({ token, ...values }));
			dispatch(
				toggleModal({
					isOpen: true,
					message: 'Todo Created',
					type: 'SUCCESS',
				})
			);

			setValues({
				title: '',
				description: '',
			});

			console.log('added todo');

			// implement
		} catch (err) {
			// implemetn
		}
	};

	console.log(userStates);

	return (
		<div className='w-screen h-screen flex bg-fuchsia-500 items-center justify-center'>
			<div className='w-1/2 h-[90%] flex bg-white rounded-xl p-8 py-4 flex-col'>
				<div className='flex  h-[10%] shrink-0 items-center justify-between text-base font-semibold text-zinc-700'>
					<h1>{userStates.name}</h1>
				</div>

				<div className='w-full h-[90%] flex flex-col  shrink-0 justify-between'>
					<div className='w-full flex flex-col gap-6 h-[90%] overflow-y-scroll'>
						<RenderTodos />
					</div>
					<form onSubmit={onSubmit} className='w-full flex items-center gap-4'>
						<div className='w-1/2'>
							<Input
								label=''
								placeholder='Title'
								onChange={handleChange('title')}
								value={values.title}
							/>
						</div>
						<div className='w-1/2'>
							<Input
								label=''
								placeholder='Description'
								onChange={handleChange('description')}
								value={values.description}
							/>
						</div>
						{todos?.creating && <CircleSpinner size={22} color='#d946ef' />}
						<div>
							<button type='submit' />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
