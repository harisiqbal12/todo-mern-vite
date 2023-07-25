/* eslint-disable react-refresh/only-export-components */
import { memo, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { StoreTypes, ModalState } from '../../store/reducers/types';
import { useBouncer } from '../../hooks';
import { toggleModal } from '../../store/reducers/modal.slice';

function Snackbar(): JSX.Element {
	const dispatch = useDispatch();
	const { bouncer } = useBouncer();

	const modalState: ModalState = useSelector((state: StoreTypes) => state.modal);

	const computedBgColor: string = useMemo(() => {
		if (modalState.type === 'ERROR') return '#f43f5e';
		if (modalState.type === 'SUCCESS') return '#4ade80';
		return '';
	}, [modalState.type]);

	useEffect(() => {
		bouncer(() => {
			dispatch(
				toggleModal({
					type: 'ERROR',
					isOpen: false,
					message: null,
				})
			);
		}, 4000)();
	}, [modalState]);

	return (
		<AnimatePresence>
			{modalState.isOpen && (
				<motion.div
					initial={{
						opacity: 0,
						bottom: 10,
					}}
					animate={{
						opacity: 1,
						bottom: 40,
					}}
					exit={{
						opacity: 0,
						bottom: 10,
					}}
					style={{
						backgroundColor: computedBgColor,
					}}
					className='p-5 px-10 text-sx font-semibold text-white rounded-lg bg-red-500 flex items-center absolute z-[9999] bottom-10 left-[45%]'>
					<span>{modalState.message}</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default memo(Snackbar);
