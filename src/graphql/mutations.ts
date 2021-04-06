import gql from 'graphql-tag';

export const LOGIN_USER = gql`
	mutation register($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			_id
			email
			username
			createdAt
			token
		}
	}
`;

export const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			_id
			email
			username
			createdAt
			token
		}
	}
`;

export const SUBMIT_COMMENT_MUTATION = gql`
	mutation createComment($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			_id
			comments {
				_id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

export const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

export const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			_id
			comments {
				_id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			_id
			likes {
				_id
				username
			}
			likeCount
		}
	}
`;
