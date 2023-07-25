/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { memo, useState, useCallback } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { GiSightDisabled } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import cookie from 'js-cookie';

import { toggleModal } from '../../../store/reducers/modal.slice';
import { deleteTodo, updateTodo } from '../../../store/reducers/todo.slice';

import type { TodoProps } from './types';
import { Button } from '..';

function Todo({ ...props }: TodoProps): JSX.Element {
	const dispatch = useDispatch();

	const [expand, setExpand] = useState(false);

	const handleToggleExpand = () => setExpand(prev => !prev);

	const handleUpdateStatus = useCallback(async () => {
		const token = cookie.get('jwt') || '';

		const response = await dispatch(
			//@ts-ignore
			updateTodo({
				token,
				status: !props.status,
				description: props.description,
				todoId: props._id,
				title: props.title,
			})
		);

		if (response?.error) {
			dispatch(
				toggleModal({
					isOpen: true,
					message: response?.error?.message,
					type: 'ERROR',
				})
			);
			return;
		}

		dispatch(
			toggleModal({
				isOpen: true,
				message: 'UPDATED',
				type: 'SUCCESS',
			})
		);
	}, [props._id]);

	const handleDelete = useCallback(async () => {
		const token = cookie.get('jwt') || '';
		const response = await dispatch(
			//@ts-ignore
			deleteTodo({
				token,
				todoId: props._id,
			})
		);

		if (response?.error) {
			dispatch(
				toggleModal({
					isOpen: true,
					message: response?.error?.message,
					type: 'ERROR',
				})
			);

			return;
		}

		dispatch(
			toggleModal({
				isOpen: true,
				message: 'DELETED',
				type: 'SUCCESS',
			})
		);
	}, [props._id]);

	return (
		<motion.div
			initial={{
				height: 40,
			}}
			animate={{
				height: expand ? 200 : 56,
			}}
			onClick={handleToggleExpand}
			className={`w-full rounded-lg shrink-0 bg-fuchsia-100 flex items-start py-2 justify-between px-4 font-semibold text-fuchsia-400 cursor-pointer transition  duration-150 flex-col ${
				expand ? '' : 'hover:bg-fuchsia-200'
			}`}>
			<div className='w-full flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<div className='w-10 h-10 rounded-full bg-fuchsia-400 text-white flex items-center justify-center'>
						{props?.status ? <BsCheckLg /> : <GiSightDisabled />}
					</div>
					<h1 className={`${props?.status === false && 'line-through'}`}>
						{props.title}
					</h1>
				</div>
				<span className='text-xs'>{props.createdAt}</span>
			</div>
			{expand && (
				<div className='flex flex-col gap-5 w-full'>
					<span className='text-xs'>{props.description}</span>
					<div className='w-full flex justify-end gap-2'>
						<Button
							title={props.status ? 'Complete' : 'Not Complete'}
							onClick={handleUpdateStatus}
							style={{ height: 40, fontSize: 12, width: '15%' }}
						/>
						<Button
							title='Update'
							style={{ height: 40, fontSize: 12, width: '15%' }}
						/>
						<Button
							title='Delete'
							style={{ height: 40, fontSize: 12, width: '15%' }}
							onClick={handleDelete}
						/>
					</div>
				</div>
			)}
		</motion.div>
	);
}

export default memo(Todo);
