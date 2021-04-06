import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { RouteComponentProps } from 'react-router-dom';

import { useForm } from '../../util/hooks/useForm';
import { AuthContext } from '../../context/Auth';
import { LOGIN_USER } from '../../graphql/mutations';

interface IUserLogin {
	username: string;
	password: string;
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const context = useContext(AuthContext);

	const initialState = {
		username: '',
		password: '',
	};

	const [errors, setErrors] = useState(initialState);

	const { OnChange, OnSubmit, values } = useForm<IUserLogin>(
		loginUserCallback,
		initialState
	);

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_proxy, { data: { login: userData } }) {
			context.login(userData);
			history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions?.exception.errors);
		},
		variables: values,
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div style={{ margin: 'auto', maxWidth: '500px' }}>
			<Form onSubmit={OnSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					type="text"
					label="Nome de Usuário"
					placeholder="escolha um nome de usuário..."
					name="username"
					error={errors.username ? true : false}
					value={values.username}
					onChange={OnChange}
				/>
				<Form.Input
					type="password"
					label="Senha"
					placeholder="digite sua senha..."
					name="password"
					error={errors.password ? true : false}
					value={values.password}
					onChange={OnChange}
				/>
				<Button type="submit" color="violet">
					Login
				</Button>
			</Form>
			{Object.values(errors).join().replaceAll(',', '') && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((err, index) => (
							<li key={index}>{err}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Login;
