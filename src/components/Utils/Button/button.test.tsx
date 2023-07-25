import { fireEvent, render } from '@testing-library/react';
import Button from '../Button';

import type { ButtonProps } from './types';

const makeSut = (props: Partial<ButtonProps>) => {
	return render(<Button title='title' onClick={jest.fn()} {...props} />);
};

describe('Login component', () => {
	test('Should render label correctly', () => {
		const { getByText } = makeSut({ title: 'My Button' });

		expect(getByText(/My Button/)).toBeInTheDocument();
	});

	test('Should call onclick successfully', () => {
		const spy = jest.fn();
		const { getByText } = makeSut({ onClick: spy });
		fireEvent.click(getByText(/title/));
		expect(spy).toHaveBeenCalled();
	});
});
