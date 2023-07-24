/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from './types';

const initialState: UserState = {
	email: null,
	authenticated: null,
	name: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		handleUser: (state, action: PayloadAction<UserState>) => {
			state.authenticated = action.payload.authenticated;
			state.email = action.payload.email;
			state.name = action.payload.name;
		},
		logoutUser: (state, _action: PayloadAction<UserState>) => {
			state.authenticated = false;
			state.email = null;
			state.name = null;
		},
		
	},
});

export const { handleUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
