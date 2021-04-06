import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { RouteComponentProps } from 'react-router-dom';

import { useForm } from '../../util/hooks/useForm';
import { AuthContext } from '../../context/Auth';
import { REGISTER_USER } from '../../graphql/mutations';

interface IUserRegister {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const context = useContext(AuthContext);
	const initialState = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	};

	const [errors, setErrors] = useState(initialState);

	const { OnChange, OnSubmit, values } = useForm<IUserRegister>(
		registerUser,
		initialState
	);

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_proxy, { data: { register: userData } }) {
			context.login(userData);
			history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions?.exception.errors);
		},
		variables: values,
	});

	function registerUser() {
		addUser();
	}

	return (
		<div style={{ margin: 'auto', maxWidth: '500px' }}>
			<Form onSubmit={OnSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Register</h1>
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
					type="email"
					label="E-Mail"
					placeholder="digite seu email..."
					name="email"
					error={errors.email ? true : false}
					value={values.email}
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
				<Form.Input
					type="password"
					label="Confirmação de Senha"
					placeholder="confirme sua senha..."
					name="confirmPassword"
					error={errors.confirmPassword ? true : false}
					value={values.confirmPassword}
					onChange={OnChange}
				/>
				<Button type="submit" color="violet">
					Registrar
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

export default Register;
