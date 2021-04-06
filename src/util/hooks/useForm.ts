import { useState } from 'react';

export function useForm<T>(callback: () => void, initialState: T) {
	const [values, setValues] = useState(initialState);

	const OnChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
		setValues({ ...values, [ev.target.name]: ev.target.value });

	const OnSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		callback();
	};

	return {
		OnChange,
		OnSubmit,
		values,
	};
}
