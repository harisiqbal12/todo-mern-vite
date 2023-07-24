import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './reducers/modal.slice';
import userReducer from './reducers/user.slice';

const store = configureStore({
	reducer: {
		modal: modalReducer,
		user: userReducer,
	},
});

export default store;
