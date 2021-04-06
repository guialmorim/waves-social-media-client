import React from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import AppConfig from './config/app-config';
import App from './App';

const httpLink = new HttpLink({
	uri: AppConfig.API_URL,
});

const authLink = setContext(() => {
	const token = localStorage.getItem(AppConfig.APP_LOCAL_STORAGE_KEY);
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	uri: AppConfig.API_URL,
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink),
});

const ApolloProviderFC: React.FC = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

export default ApolloProviderFC;
