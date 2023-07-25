import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TodoState, TodoProps, UpdateTodoProps } from './types';
import axios from 'axios';

const initialState: TodoState = {
	todos: [],
	loading: false,
	error: null,
	creating: false,
	update: {
		show: false,
		_id: null,
		title: null,
		description: null,
		status: false,
	},
};

export const fetchTodos = createAsyncThunk(
	'todos/fetchTodos',
	async (token: string) => {
		try {
			const response = await axios('http://localhost:4000/api/todo', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response?.data?.error) {
				throw new Error(response?.data?.message);
			}

			return response?.data?.data;
		} catch (err) {
			throw new Error('Failed to fetch todos');
			// implements error bloc
		}
	}
);

export const addTodo = createAsyncThunk(
	'todos/addTodo',
	async ({
		token,
		title,
		description,
	}: {
		token: string;
		title: string;
		description: string;
	}) => {
		try {
			const response = await axios('http://localhost:4000/api/todo', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					title,
					description,
				},
			});

			if (response.data?.error) {
				throw new Error(response?.data?.message);
			}

			return response?.data?.data;
		} catch (err) {
			throw new Error('Failed to create a todo');
		}
	}
);

export const deleteTodo = createAsyncThunk(
	'todos/deleteTodo',
	async ({ token, todoId }: { token: string; todoId: string }) => {
		try {
			const response = await axios('http://localhost:4000/api/todo', {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					todo_id: todoId,
				},
			});

			console.log('RESPONSE');
			console.log(response);

			if (response?.data?.error) {
				throw new Error(response?.data?.message);
			}

			console.log(response);
			console.log('deleted todo response');
			return response?.data?.data;
		} catch (err) {
			throw new Error('Failed to delete todo');
		}
	}
);

export const updateTodo = createAsyncThunk(
	'todos/updateTodo',
	async ({
		token,
		todoId,
		title,
		description,
		status,
	}: {
		token: string;
		todoId: string;
		title: string;
		description: string;
		status: boolean;
	}) => {
		try {
			const response = await axios('http://localhost:4000/api/todo', {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					todo_id: todoId,
					title,
					description,
					status,
				},
			});

			if (response?.data?.error) {
				throw new Error(response?.data?.message);
			}

			return response.data.data;
		} catch (err) {
			throw new Error('Failed to update todo');
		}
	}
);

const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		getTodos: (state, action: PayloadAction<TodoState>) => {
			state.todos = action.payload.todos;
		},
		setUpdate: (state, action: PayloadAction<UpdateTodoProps>) => {
			state.update = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchTodos.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchTodos.fulfilled,
				(state, action: PayloadAction<TodoProps[]>) => {
					state.loading = false;
					state.error = null;

					state.todos = action.payload;
				}
			)
			.addCase(fetchTodos.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(addTodo.pending, state => {
				state.creating = true;
				state.error = null;
			})
			.addCase(addTodo.fulfilled, (state, action: PayloadAction<TodoProps>) => {
				state.creating = false;
				state.error = null;
				state.todos.push(action.payload);
			})
			.addCase(addTodo.rejected, (state, action) => {
				state.creating = false;
				state.error = action.error.message;
			})
			.addCase(deleteTodo.pending, state => {
				state.creating = true;
				state.error = null;
			})
			.addCase(
				deleteTodo.fulfilled,
				(state, action: PayloadAction<TodoProps>) => {
					state.creating = false;
					state.error = null;
					state.todos = state.todos.filter(el => el._id === action.payload._id);
				}
			)
			.addCase(deleteTodo.rejected, (state, action) => {
				state.creating = false;
				state.error = action.error.message;
			})
			.addCase(updateTodo.pending, state => {
				state.creating = true;
				state.error = null;
			})
			.addCase(
				updateTodo.fulfilled,
				(state, action: PayloadAction<TodoProps>) => {
					state.creating = false;
					state.error = null;

					state.todos = state.todos.map(el => {
						if (el._id === action.payload._id) {
							return {
								...el,
								...action.payload,
							};
						}

						return el;
					});
				}
			)
			.addCase(updateTodo.rejected, (state, action) => {
				state.creating = false;
				state.error = action.error.message;
			});
	},
});

export const { getTodos, setUpdate } = todoSlice.actions;
export default todoSlice.reducer;
