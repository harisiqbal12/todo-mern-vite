import { useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

export default function Component(): JSX.Element {
	const history = useHistory();

	function Render(): JSX.Element {
		if (history.location.pathname === '/register') {
			return <Register />;
		}

		return <Login />;
	}

	return (
		<div className='h-screen w-screen flex'>
			<div className='w-1/2 h-full flex-col bg-fuchsia-500 flex p-20 text-white shrink-0'>
				<h1 className='text-heading font-bold'>Todo</h1>
				<span className='font-semibold -mt-4'>Todo by appiskey</span>
			</div>

			<Render />
		</div>
	);
}
