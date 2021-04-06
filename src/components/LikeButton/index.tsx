import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { IPost } from '../../models/Post';
import { LIKE_POST_MUTATION } from '../../graphql/mutations';
import { LoggedUser } from '../../context/Auth';

interface IProps {
	user: LoggedUser | null;
	post: IPost;
	children?: ReactNode;
}

const LikeButton: React.FC<IProps> = ({ user, post }) => {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && post.likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, post.likes]);

	const [likePost, { loading }] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: post._id },
		onError(err) {
			console.error(err);
		},
	});

	const likeButton = user ? (
		<Button
			loading={loading}
			color="violet"
			size="tiny"
			basic={!liked}
			onClick={() => likePost()}
		>
			<Icon name="heart" style={{ margin: '0' }} />
		</Button>
	) : (
		<Button
			loading={loading}
			color="violet"
			size="tiny"
			basic={!liked}
			as={Link}
			to="/login"
		>
			<Icon name="heart" style={{ margin: '0' }} />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" size="tiny">
			{likeButton}
			<Label basic={liked} as="a" color="violet" pointing="left">
				{post.likeCount}
			</Label>
		</Button>
	);
};

export default LikeButton;
