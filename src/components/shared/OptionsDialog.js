import React from "react";
import { useOptionsDialogStyles } from "../../styles";
import { Dialog, Zoom, Button, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { defaultPost } from '../../data';
import { UserContext } from '../../App';
import { UNFOLLOW_USER } from '../../graphql/mutations';
import { useMutation } from "@apollo/react-hooks";

const OptionsDialog = ({ postId, authorId, onClose }) => {
  const classes = useOptionsDialogStyles();
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isOwner = authorId === currentUserId;
  const buttonText = isOwner ? 'Delete' : 'Unfollow';
  const onClick = isOwner ? handleDeletePost : handleUnfollowUser;
  const isFollowing = followingIds.some(id => id === authorId);
  const isUnrelatedUser = !isOwner && !isFollowing;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleDeletePost = () => {

  };

  const handleUnfollowUser = () => {
    const variables = {
      userIdToFollow: authorId,
      currentUserId
    }
    unfollowUser({ variables });
    onClose();
  };

  return (
    <Dialog
      open
      fullWidth
      onClose={onClose}
      style={{
        scrollPaper: classes.dialogScrollPaper
      }}
      TransitionComponent={Zoom}
    >
      {
        !isUnrelatedUser && <Button className={classes.redButton}>Unfollow</Button>
      }
      <Divider />
      <Button className={classes.button}>
        <Link to={`/p/${defaultPost.id}`}>
          Go to post
        </Link>
      </Button>
      <Divider />
      <Button className={classes.button}>
        Share
      </Button>
      <Divider />
      <Button className={classes.button}>
        Copy Link
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.button}>
        Cancel
      </Button>
    </Dialog>
  )
}

export default OptionsDialog;
