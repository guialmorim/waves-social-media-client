import React, { useContext, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
	Dimmer,
	Loader,
	Image,
	Item,
	Comment,
	Header,
	Form,
	Card,
} from 'semantic-ui-react';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
//@ts-ignore
import PT_BR_MOMENT_LOCALE from 'moment/locale/pt-br';

import { FETCH_POST_QUERY } from '../../graphql/queries';
import { SUBMIT_COMMENT_MUTATION } from '../../graphql/mutations';
import { AuthContext } from '../../context/Auth';
import LikeButton from '../../components/LikeButton';
import DeleteButton from '../../components/DeleteButton';
import { IPost } from '../../models/Post';

moment.locale('pt-br', PT_BR_MOMENT_LOCALE);

interface MatchParams {
	postId: string;
}

const SinglePost: React.FC<RouteComponentProps<MatchParams>> = ({
	match: {
		params: { postId },
	},
	history,
}) => {
	const { user } = useContext(AuthContext);

	const [comment, setComment] = useState('');

	const commentInputRef = useRef<HTMLInputElement>(null);

	const { data: post, loading } = useQuery<{ getPost: IPost }>(
		FETCH_POST_QUERY,
		{
			variables: { postId },
		}
	);

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current?.blur();
		},
		onError(err) {
			console.error(err);
		},
		variables: { postId, body: comment },
	});

	function deletePostCallback() {
		history.push('/');
	}

	if (!post?.getPost || loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Dimmer active>
					<Loader>Carregando...</Loader>
				</Dimmer>
				<Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
			</div>
		);
	}

	return (
		<React.Fragment>
			<Item.Group>
				<Item>
					<Item.Image
						size="tiny"
						src="https://react.semantic-ui.com/images/avatar/large/molly.png"
					/>

					<Item.Content>
						<Item.Header>{post.getPost.username}</Item.Header>
						<Item.Meta>{moment(post.getPost.createdAt).fromNow()}</Item.Meta>
						<Item.Description>{post.getPost.body}</Item.Description>
						<Item.Extra>
							<LikeButton user={user} post={post.getPost} />

							{user && user.username === post.getPost.username && (
								<DeleteButton
									postId={post.getPost._id!}
									callback={deletePostCallback}
								/>
							)}
						</Item.Extra>
					</Item.Content>
				</Item>
			</Item.Group>
			{user && (
				<Card fluid>
					<Card.Content>
						<p>Adicione um comentário</p>
						<Form>
							<div className="ui action input fluid">
								<input
									ref={commentInputRef}
									type="text"
									placeholder="digite seu comentário..."
									name="comment"
									value={comment}
									onChange={(ev) => setComment(ev.target.value)}
								/>
								<button
									type="submit"
									className="ui button violet"
									disabled={comment.trim() === ''}
									onClick={() => submitComment()}
								>
									Enviar
								</button>
							</div>
						</Form>
					</Card.Content>
				</Card>
			)}
			<Comment.Group size="large">
				<Header as="h3" dividing>
					Comentários
				</Header>
				{post.getPost?.comments.length > 0 ? (
					post.getPost?.comments.map((comment) => (
						<Comment key={comment._id}>
							<Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
							<Comment.Content>
								<Comment.Author as="a">{comment.username}</Comment.Author>
								<Comment.Metadata>
									<div>{moment(comment.createdAt).fromNow()}</div>
								</Comment.Metadata>
								<Comment.Text>{comment.body}</Comment.Text>
								<Comment.Actions>
									<Comment.Action
										as="a"
										onClick={() => commentInputRef.current?.focus()}
									>
										Responder
									</Comment.Action>
									{user && user.username === comment.username && (
										<DeleteButton
											postId={post.getPost._id!}
											commentId={comment._id}
										/>
									)}
								</Comment.Actions>
							</Comment.Content>
						</Comment>
					))
				) : (
					<Header as="h5">Sem comentários por enquanto {':('}</Header>
				)}
			</Comment.Group>
		</React.Fragment>
	);
};

export default SinglePost;
