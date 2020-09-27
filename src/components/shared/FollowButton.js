import React from "react";
import { useFollowButtonStyles } from "../../styles";
import { Button } from "@material-ui/core";
import { UserContext } from '../../App';
import { useMutation } from "@apollo/react-hooks";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";

function FollowButton({ id, side }) {
  const classes = useFollowButtonStyles({ side });
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(followingId => followingId === id);
  const [isFollowing, setFollowing] = React.useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER)
  const variables = {
    userIdToFollow: id,
    currentUserId
  };

  const handleFollowUser = () => {
    setFollowing(true);
    followUser({ variables });
  };

  const handleUnfollowUser = () => {

  };


  const followButton = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      className={classes.button}
      onClick={handleFollowUser}
      fullWidth
    >
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? "text" : "outlined"}
      className={classes.button}
      onClick={handleUnfollowUser}
      fullWidth
    >
      Following
    </Button>
  );

  return isFollowing ? followingButton : followButton;
}

export default FollowButton;
