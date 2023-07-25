/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-refresh/only-export-components */

import { ChangeEvent, memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { StoreTypes, UpdateTodoProps } from '../../store/reducers/types';
import { toggleModal } from '../../store/reducers/modal.slice';
import { updateTodo, setUpdate } from '../../store/reducers/todo.slice';
import { Button, Input } from '../Utils';
import cookie from 'js-cookie';

function Modal(): JSX.Element {
	const dispatch = useDispatch();
	const updateState: UpdateTodoProps = useSelector(
		(state: StoreTypes) => state.todo.update
	);
  const loading: boolean = useSelector((state: StoreTypes) => state.todo.creating || state.todo.loading);

	const [values, setValues] = useState<{
		title: string;
		description: string;
	}>({
		title: '',
		description: '',
	});

	useEffect(() => {
		setValues({
			title: updateState?.title || '',
			description: updateState?.description || '',
		});
	}, [updateState?.description, updateState?.title]);

	const handleChangeValues =
		(type: string) => (e: ChangeEvent<HTMLInputElement>) => {
			setValues(prev => ({ ...prev, [type]: e.target.value }));
		};

	const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			if (!values?.title?.length) {
				dispatch(
					toggleModal({
						isOpen: true,
						type: 'ERROR',
						message: 'Title not define',
					})
				);

				return;
			}

			const token = cookie.get('jwt');

			const response = await dispatch(
				//@ts-ignore
				updateTodo({
					status: updateState.status,
					todoId: updateState._id || '',
					token: token || '',
					title: values.title,
					description: values.description,
				})
			);

			if (response?.error) {
				dispatch(
					toggleModal({
						isOpen: true,
						type: 'ERROR',
						message: response?.error?.message,
					})
				);
				return;
			}

			dispatch(
				toggleModal({
					isOpen: true,
					type: 'SUCCESS',
					message: 'Updated',
				})
			);

			dispatch(
				setUpdate({
					show: false,
					status: false,
					title: null,
					description: null,
					_id: null,
				})
			);
		} catch (err) {
			//
		}
	};

	return (
		<AnimatePresence>
			{updateState.show && (
				<motion.div
					initial={{
						opacity: 0,
						bottom: '5%',
					}}
					animate={{
						bottom: '30%',
						opacity: 1,
					}}
					id='dropshadow'
					className='w-[40%] h-[60%] bg-white absolute z-[99] top-[20%] left-[30%] rounded-lg shadow-lg flex flex-col p-5 '>
					<span className='text-sx font-semibold text-zinc-800 uppercase tracking-wider'>
						Update Todo
					</span>
					<form
						onSubmit={onSubmit}
						className='mt-5 flex flex-col  h-full justify-between'>
						<div className='flex flex-col gap-4'>
							<Input
								title='Title'
								label=''
								placeholder='Todo title'
								onChange={handleChangeValues('title')}
								value={values.title}
							/>
							<Input
								title='Description'
								label=''
								placeholder='Todo Description'
								onChange={handleChangeValues('description')}
								value={values.description}
							/>
						</div>
						<Button
							title='Update'
							type='submit'
							loading={loading}
							style={{ width: '100%', height: '50px', fontSize: 12 }}
						/>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default memo(Modal);
