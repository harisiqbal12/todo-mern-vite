import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from './types';

const initialState: ModalState = {
	isOpen: false,
	message: null,
	type: 'ERROR',
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		toggleModal: (state, action: PayloadAction<ModalState>) => {
			state.message = action.payload.message;
			state.isOpen = action.payload.isOpen;
			state.type = action.payload.type;
		},
	},
});

export const { toggleModal } = modalSlice.actions;
export default modalSlice.reducer;
