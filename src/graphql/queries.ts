import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	query {
		getPosts {
			_id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				_id
				username
				createdAt
				body
			}
		}
	}
`;

export const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			_id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				_id
				username
				createdAt
				body
			}
		}
	}
`;
