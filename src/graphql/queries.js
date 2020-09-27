import { gql } from 'apollo-boost';

export const CHECK_IF_USERNAME_TAKEN = gql`
	query checkIfUsernameTaken($username: String!) {
		users( where: { username: { _eq: $username } } ) {
			username
		}
	}
`;

export const GET_USER_EMAIL = gql`
	query getUserEmail($input: String!) {
		users(
			where: {
				_or: [
					{ username: { _eq: $input } },
					{ phone_number: { _eq: $input } }
				]
			}
		) {
			emal
		}
	}
`;

export const GET_EDIT_USER_PROFILE = gql`
	query getEditUserProfile($id: uuid!) {
		users_by_pk(id: $id) {
			id
			username
			name
			emal
			bio
			profile_image
			website
			phone_number
		}
	}
`;


export const SEARCH_USERS = gql`
	query searchUsers($query: String) {
		users(where: {
			_or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }]
		}) {
			id
			username
			name
			profile_image
		}
	}
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      name
      username
      website
      bio
      profile_image
      posts_aggregate {
        aggregate {
          count
        }
      }
      followers_aggregate {
        aggregate {
          count
        }
      }
      following_aggregate {
        aggregate {
          count
        }
      }
      saved_posts(order_by: { created_at: desc }) {
        posts {
          id
          media
          likes_aggregate {
            aggregate {
              count
            }
          }
          comments_aggregate {
            aggregate {
              count
            }
          }
        }
      }
      posts(order_by: { created_at: desc }) {
        id
        media
        likes_aggregate {
          aggregate {
            count
          }
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;


export const SUGGEST_USERS = gql`
  query suggestUsers(
    $limit: Int!
    $followerIds: [uuid!]!
    $createdAt: timestamptz!
  ) {
    users(
      limit: $limit
      where: {
        _or: [
          { id: { _in: $followerIds } }
          { created_at: { _gt: $createdAt } }
        ]
      }
    ) {
      id
      username
      name
      profile_image
    }
  }
`;

export const EXPLORE_POSTS = gql`
  query explorePosts($followingIds: [uuid!]!) {
    posts(order_by: {
      created_at: desc, 
      likes_aggregate: {count: desc}},
      where: { id: {_nin: $followingIds}}  
    ) {
      id
      media
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;