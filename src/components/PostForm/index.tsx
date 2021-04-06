import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../../util/hooks/useForm';
import { FETCH_POSTS_QUERY } from '../../graphql/queries';
import { IPost } from '../../models/Post';

const PostForm: React.FC = () => {
	const initialState = {
		body: '',
	};

	const [errors, setErrors] = useState(initialState);

	const { OnChange, OnSubmit, values } = useForm(
		createPostCallback,
		initialState
	);

	const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			let data = proxy.readQuery<{ getPosts: IPost[] } | null>({
				query: FETCH_POSTS_QUERY,
			});
			if (data && data.getPosts) {
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						getPosts: [result.data.createPost, ...data.getPosts],
					},
				});
			}

			values.body = '';
		},
		onError(err) {
			setErrors({ body: err.message });
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<React.Fragment>
			<Form onSubmit={OnSubmit} noValidate className={loading ? 'loading' : ''}>
				<h2>Adicionar novo Post</h2>

				<Form.Input
					placeholder="digite seu post..."
					name="body"
					onChange={OnChange}
					value={values.body}
				/>

				<Button type="submit" color="violet">
					Enviar
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
		</React.Fragment>
	);
};

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			_id
			body
			createdAt
			username
			likes {
				_id
				username
				createdAt
			}
			likeCount
			commentCount
			comments {
				_id
				body
				username
				createdAt
			}
		}
	}
`;

export default PostForm;
