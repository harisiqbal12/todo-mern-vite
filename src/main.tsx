import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

import AppRouter from './App';
import { Provider } from 'react-redux';
import store from './store/index';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CookiesProvider>
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</CookiesProvider>
	</React.StrictMode>
);
