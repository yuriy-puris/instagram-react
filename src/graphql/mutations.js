import { gql } from 'apollo-boost';

export const CREATE_USER = gql`
	mutation createUsers(
		$userId: String!, 
		$name: String!, 
		$username: String!, 
		$emal: String!, 
		$bio: String, 
		$last_checked: String!, 
		$phone_number: String!, 
		$profile_image: String!, 
		$website: String!) {
		insert_users(
			objects: {
				website: $website, 
				username: $username, 
				user_id: $userId, 
				profile_image: $profile_image, 
				phone_number: $phone_number, 
				name: $name, 
				last_checked: $last_checked, 
				emal: $emal, 
				bio: $bio 
			}) {
			affected_rows
		}
	}
`;

export const EDIT_USER = gql`
	mutation editUser(
		$id: uuid!, 
		$name: String!, 
		$username: String!, 
		$emal: String!, 
		$bio: String,  
		$website: String!
    	$phoneNumber: String!) {
			update_users(
				where: {id: { _eq: $id }},
				_set: {
					website: $website, 
					username: $username, 
					name: $name, 
					phone_number: $phoneNumber, 
					emal: $emal, 
					bio: $bio
				}
			) {
			affected_rows
		}
	}
`;


export const EDIT_USER_AVATAR = gql`
	mutation editUser(
		$id: uuid!,
    	$profileImage: String!
		) {
			update_users(
				where: {id: { _eq: $id }},
				_set: {
					profile_image: $profileImage
				}
			) {
			affected_rows
		}
	}
`;