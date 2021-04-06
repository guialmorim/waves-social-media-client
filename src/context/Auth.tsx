import React, { useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import { IUser } from '../models/User';
import AppConfig from '../config/app-config';

export interface LoggedUser extends IUser {
	token: string;
}

interface IUserContext {
	user: LoggedUser | null;
	login: (userData: IUser) => void;
	logout: () => void;
}

interface DecodedToken {
	exp: number;
	iat: number;
}

function getStoredUser() {
	const token = localStorage.getItem(AppConfig.APP_LOCAL_STORAGE_KEY);

	if (token) {
		const decodedToken = jwtDecode<DecodedToken>(token!);

		if (decodedToken.exp * 1000 < Date.now()) {
			localStorage.removeItem(AppConfig.APP_LOCAL_STORAGE_KEY);
			return null;
		} else {
			return {
				...decodedToken,
				token,
			};
		}
	} else {
		return null;
	}
}

let initialState = {
	user: getStoredUser(),
};

const AuthContext = React.createContext<IUserContext>({
	user: null,
	login: (userData) => {},
	logout: () => {},
});

function authReducer(state, action) {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				user: action.payload,
			};
		case 'LOGOUT':
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
}

function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState);

	function login(userData: LoggedUser) {
		localStorage.setItem(AppConfig.APP_LOCAL_STORAGE_KEY, userData.token);
		dispatch({
			type: 'LOGIN',
			payload: userData,
		});
	}

	function logout() {
		localStorage.removeItem(AppConfig.APP_LOCAL_STORAGE_KEY);

		dispatch({
			type: 'LOGOUT',
		});
	}

	return (
		<AuthContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		/>
	);
}

export { AuthContext, AuthProvider };
