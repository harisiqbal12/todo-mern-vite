/* eslint-disable @typescript-eslint/ban-ts-comment */
import Input from '.';
import { render } from '@testing-library/react';

import type { InputTypes } from './types';

const makeSut = (props: Partial<InputTypes>) => {
	//@ts-ignore
	return render(<Input label={props.label || ''} {...props} />);
};

describe('<Input />', () => {
	it('Should render the input', () => {
		const { getByPlaceholderText } = makeSut({
			label: 'input_field',
			placeholder: 'input_field_placeholder',
		});

		expect(getByPlaceholderText(/input_field_placeholder/)).toBeInTheDocument();
	});
});
