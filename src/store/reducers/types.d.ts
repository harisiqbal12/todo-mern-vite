/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalState {
	isOpen: boolean;
	message: string | null;
	type: 'ERROR' | 'SUCCESS';
}

export interface StoreTypes {
	modal: ModalState;
	user: UserState;
	todo: TodoState;
}

export interface UserState {
	email: string | null;
	authenticated: boolean | null;
	name: string | null;
}

export interface TodoState {
	todos: Array<TodoProps>;
	loading: boolean;
	error: any;
	creating: boolean;
	update: UpdateTodoProps;
}

export interface UpdateTodoProps {
	_id: string | null;
	show: boolean;
	title: string | null;
	description: string | null;
	status: boolean;
}

export interface TodoProps {
	_id: string;
	title: string;
	description: string;
	status: boolean;
	user: string;
	createdAt: string;
	updatedAt: string;
}
