export interface ModalState {
	isOpen: boolean;
	message: string | null;
	type: 'ERROR' | 'SUCCESS';
}

export interface StoreTypes {
	modal: ModalState;
	user: UserState;
}

export interface UserState {
	email: string | null;
	authenticated: boolean | null;
	name: string | null;
}
