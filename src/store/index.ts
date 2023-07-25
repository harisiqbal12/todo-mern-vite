import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './reducers/modal.slice';
import userReducer from './reducers/user.slice';
import todoReducer from './reducers/todo.slice';

const store = configureStore({
	reducer: {
		modal: modalReducer,
		user: userReducer,
		todo: todoReducer,
	},
});

export default store;
