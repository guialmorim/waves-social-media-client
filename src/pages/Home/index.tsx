import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Grid, Header, Icon, Transition } from 'semantic-ui-react';

import { AuthContext } from '../../context/Auth';
import { IPost } from '../../models/Post';
import PostCard from '../../components/PostCard';
import PostForm from '../../components/PostForm';
import { FETCH_POSTS_QUERY } from '../../graphql/queries';

const Home: React.FC = () => {
	const { user } = useContext(AuthContext);
	const { loading, data: posts } = useQuery<{ getPosts: IPost[] }>(
		FETCH_POSTS_QUERY
	);

	return (
		<Grid>
			<Grid.Row>
				<div style={{ margin: 'auto' }}>
					<Header as="h2" icon>
						<Icon name="users" />
						Posts Recentes
						<Header.Subheader>
							Veja aqui o que as pessoas estão comentando recentemente!
						</Header.Subheader>
					</Header>
				</div>
			</Grid.Row>
			{user && (
				<Grid.Row>
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				</Grid.Row>
			)}

			<Grid.Row>
				{loading ? (
					<h3>carregando...</h3>
				) : (
					<Transition.Group duration={300}>
						{posts && posts?.getPosts?.length > 0 && (
							<Grid.Column>
								<Card.Group style={{ display: 'flex', flexWrap: 'wrap' }}>
									{posts.getPosts.map((post) => (
										<PostCard key={post._id} post={post} />
									))}
								</Card.Group>
							</Grid.Column>
						)}
					</Transition.Group>
				)}
			</Grid.Row>
		</Grid>
	);
};

export default Home;
