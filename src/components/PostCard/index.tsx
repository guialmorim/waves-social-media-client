import React, { ReactNode, useContext } from 'react';
import { Card, Image, Button, Label, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
//@ts-ignore
import PT_BR_MOMENT_LOCALE from 'moment/locale/pt-br';

import { IPost } from '../../models/Post';
import { AuthContext } from '../../context/Auth';
import LikeButton from '../../components/LikeButton';
import DeleteButton from '../../components/DeleteButton';

moment.locale('pt-br', PT_BR_MOMENT_LOCALE);

interface IProps {
	children?: ReactNode;
	post: IPost;
}

const PostCard: React.FC<IProps> = ({ post }) => {
	const { user } = useContext(AuthContext);

	return (
		<Card>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/molly.png"
				/>
				<Card.Header>{post.username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${post._id}`}>
					{moment(post.createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{post.body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div>
						<LikeButton user={user} post={post} />
						<Button as="div" labelPosition="right" size="tiny">
							<Button
								basic
								color="blue"
								size="tiny"
								as={Link}
								to={`posts/${post._id}`}
							>
								<Icon name="comments" style={{ margin: '0' }} />
							</Button>
							<Label as="a" color="blue" pointing="left">
								{post.commentCount}
							</Label>
						</Button>
					</div>
					{user && user.username === post.username && (
						<div>
							<DeleteButton postId={post._id!} />
						</div>
					)}
				</div>
			</Card.Content>
		</Card>
	);
};

export default PostCard;
