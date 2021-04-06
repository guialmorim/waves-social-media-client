import React, { useState } from 'react';
import { Button, Icon, Confirm, Header } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

import {
	DELETE_POST_MUTATION,
	DELETE_COMMENT_MUTATION,
} from '../../graphql/mutations';
import { FETCH_POSTS_QUERY } from '../../graphql/queries';
import { IPost } from '../../models/Post';

interface IProps {
	postId: string;
	commentId?: string;
	callback?(): void;
}

const DeleteButton: React.FC<IProps> = ({ postId, commentId, callback }) => {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation, { loading }] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);

			if (!commentId) {
				const data = proxy.readQuery<{ getPosts: IPost[] } | null>({
					query: FETCH_POSTS_QUERY,
				});

				if (data && data.getPosts) {
					proxy.writeQuery({
						query: FETCH_POSTS_QUERY,
						data: {
							getPosts: data.getPosts.filter((p) => p._id !== postId),
						},
					});
				}
			}

			if (callback) callback();
		},
		onError(err) {
			console.log(err);
		},
		variables: { postId, commentId },
	});

	return (
		<React.Fragment>
			{commentId ? (
				<Header as="a" size="tiny" onClick={() => setConfirmOpen(true)}>
					Excluir
				</Header>
			) : (
				<Button
					loading={loading}
					basic
					icon
					color="red"
					size="tiny"
					onClick={() => setConfirmOpen(true)}
				>
					<Icon name="trash alternate outline" style={{ margin: '0' }} />
				</Button>
			)}
			<Confirm
				open={confirmOpen}
				content={`Você tem certeza que deseja apagar este ${
					commentId ? 'comentário' : 'post'
				}?`}
				cancelButton="Não!"
				confirmButton={loading ? 'carregando...' : 'Sim!'}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => deletePostOrMutation()}
			/>
		</React.Fragment>
	);
};

export default DeleteButton;
