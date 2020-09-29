import React from "react";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  RemoveIcon,
  SaveIcon
} from "../../icons";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
  Avatar
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
import PostSkeleton from './PostSkeleton';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { GET_POST } from '../../graphql/subscriptions';
import { UserContext } from '../../App';
import { LIKE_POST, UNLIKE_POST, SAVE_POST, UNSAVE_POST, CREATE_COMMENT } from "../../graphql/mutations";
import { formatPostDate, formatDateToNowShort } from '../../utils/formateDate';


function Post({ postId }) {
  const classes = usePostStyles();
  const [showOptionsDialog, setOptionsDialog] = React.useState(false);
  const variables = { postId };
  const { data, loading } = useSubscription(GET_POST, { variables });

  if (loading) return <PostSkeleton />;

  const {
    id,
    media,
    likes,
    likes_aggregate,
    saved_posts,
    location,
    user,
    caption,
    comments,
    created_at,
  } = data.posts_by_pk;
  const likesCount = likes_aggregate.aggregate.count;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} location={location} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setOptionsDialog(true)}
          />
        </div>
        {/* Post Image */}
        <div className={classes.postImage}>
          <img src={media} alt="Post media" className={classes.image} />
        </div>
        {/* Post Buttons */}
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton likes={likes} authorId={user.id} postId={id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savedPosts={saved_posts} authorId={user.id} postId={id} />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          <div
            style={{
              overflow: 'scroll',
              padding: '16px 12px !important',
              height: '100%'
            }}
          >
            <AuthorCaption user={user} createdAt={created_at} caption={caption} />
            { comments.map(comment => (
              <UserComment key={comment.id} comment={comment} />
            )) }
          </div>
          <Typography color="textSecondary" className={classes.datePosted}>
            { formatPostDate(created_at) }
          </Typography>
          <Hidden xsDown>
            <div className={classes.comment}>
              <Divider />
              <Comment postId={id} />
            </div>
          </Hidden>
        </div>
      </article>
      {showOptionsDialog && (
        <OptionsDialog postId={id} authorId={user.id} onClose={() => setOptionsDialog(false)} />
      )}
    </div>
  );
};

const AuthorCaption = ({ user, caption, createdAt }) => {
  const classes = usePostStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={user.profile_image}
        alt='User avatar'
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={user.username}>
          <Typography variant='subtitle1' component='span' className={classes.username}>
            { user.username }
          </Typography>
          <Typography 
            variant='body2' 
            component='span' 
            className={classes.postCaption} 
            style={{ paddingLeft: 0 }}>
            { user.username }
          </Typography>
          <Typography variant='caption' color='textSecondary' style={{ display: 'inline-block', marginTop: 16, marginBottom: 4 }}>
            { formatDateToNowShort(createdAt) }
          </Typography>
        </Link>
      </div>
    </div>
  )
};

const UserComment = ({ comment }) => {
  const classes = usePostStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={comment.user.profile_image}
        alt='User avatar'
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={comment.user.username}>
          <Typography variant='subtitle1' component='span' className={classes.username}>
            { comment.user.username }
          </Typography>
          <Typography 
            variant='body2' 
            component='span' 
            className={classes.postCaption} 
            style={{ paddingLeft: 0 }}>
            { comment.content }
          </Typography>
          <Typography variant='caption' color='textSecondary' style={{ display: 'inline-block', marginTop: 16, marginBottom: 4 }}>
            { formatDateToNowShort(comment.created_at) }
          </Typography>
        </Link>
      </div>
    </div>
  )
};

function LikeButton({ likes, postId, authorId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(user_id => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId
  };

  function handleLike() {
    setLiked(true);
    likePost({ variables });
  };

  function handleUnlike() {
    setLiked(false);
    unlikePost({ variables });
  };

  return <Icon className={className} onClick={onClick} />;
}

function SaveButton({ savedPosts, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(({ user_id }) => user_id === currentUserId);
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId
  };

  function handleSave() {
    console.log('like');
    setSaved(true);
    savePost({ variables });
  }

  function handleRemove() {
    setSaved(false);
    unsavePost({ variables });
  }

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const [content, setContent] = React.useState("");
  const [createComment] = useMutation(CREATE_COMMENT);
  const variables = {
    postId,
    userId: currentUserId,
    content
  };

  const handleAddComment = () => {
    createComment({ variables });
    setContent('');
  };

  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment..."
        multiline
        rowsMax={2}
        rows={1}
        onChange={event => setContent(event.target.value)}
        className={classes.textField}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline
          }
        }}
      />
      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
        onClick={handleAddComment}
      >
        Post
      </Button>
    </div>
  );
}

export default Post;
