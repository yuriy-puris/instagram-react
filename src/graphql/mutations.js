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