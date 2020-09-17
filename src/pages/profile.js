import React from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import ProfilePicture from "../components/shared/ProfilePicture";
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  Zoom,
  Divider,
  DialogTitle,
  Avatar
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "../auth";
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_PROFILE } from '../graphql/queries';
import LoadingScreen from '../components/shared/LoadingScreen';
import { UserContext } from '../App';

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUserId } = React.useContext(UserContext)
  const classes = useProfilePageStyles();
  const [showOptionsMenu, setOptionsMenu] = React.useState(false);
  const variables = { username };
  const { data, loading } = useQuery(GET_USER_PROFILE, { variables });

  if (loading) return <LoadingScreen />;
  const [user] = data.users;
  const isOwner = user.id === currentUserId;

  const handleOptionsMenuClick = () => {
    setOptionsMenu(true);
  };

  const handleCloseMenu = () => {
    setOptionsMenu(false);
  };

  return (
    <Layout title={`${user.name} (@${user.username})`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} image={user.profile_image} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection 
                user={user}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture size={77} isOwner={isOwner} image={user.profile_image} />
                <ProfileNameSection 
                  user={user}
                  isOwner={isOwner}
                  handleOptionsMenuClick={handleOptionsMenuClick}
                />
              </section>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card> 
        </Hidden>
      </div>
      { showOptionsMenu && <OptionsMenu handleCloseMenu={handleCloseMenu} /> }
      <ProfileTabs user={user} isOwner={isOwner} />
    </Layout>
  )
};

const ProfileNameSection = ({ user, isOwner, handleOptionsMenuClick }) => {
  const [showUnfollowDialog, setUnfollowDialog] = React.useState(false);
  const classes = useProfilePageStyles();
  let followButton;
  const isFollowing = true;
  const isFollower = false;
  if ( isFollowing ) {
    followButton = (
      <Button onClick={() => setUnfollowDialog(true)} className={classes.button} variant='outlined'>
        Following
      </Button>
    );
  } else if ( isFollower ) {
    followButton = (
      <Button className={classes.button} color='primary' variant='contained'>
        Follow back
      </Button>
    );
  } else {
    followButton = (
      <Button className={classes.button} color='primary' variant='contained'>
        Follow
      </Button>
    );
  }

  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>
            {user.username}
          </Typography>
          { isOwner ? (
            <>  
              <Link to='/accounts/edit'>
                <Button variant='outlined'>Edit profile</Button>
              </Link>
              <div className={classes.settingsWrapper} onClick={handleOptionsMenuClick}>
                <GearIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <>
              {followButton}
            </>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && (
              <div className={classes.settingsWrapper} onClick={handleOptionsMenuClick}>
                <GearIcon className={classes.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to='/accounts/edit'>
              <Button variant='outlined' style={{ width: '100%' }}>Edit profile</Button>
            </Link>
          ) : followButton}
        </section>
      </Hidden>
      { showUnfollowDialog && <UnfollowDialog onClose={() => setUnfollowDialog(false)} user={user} /> }
    </>
  )
};

const UnfollowDialog = ({ user, onClose }) => {
  const classes = useProfilePageStyles();

  return (
    <Dialog
      open
      onClose
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper,
      }}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar 
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          className={classes.avatar}
        />
      </div>
      <Typography align='center' variant='body2' className={classes.unfollowDialogText} >
        Unfollow @{user.username}
      </Typography>
      <Divider />
      <Button className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  )
}

const PostCountSection = ({ user }) => {
  const classes = useProfilePageStyles();
  const options = ['posts', 'followers', 'following'];

  return (
    <>
      <Hidden xsDown>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {
          options.map(option => (
            <div key={option} className={classes.followingText}>
              <Typography className={classes.followingCount}>
                {user[`${option}_aggregate`].aggregate.count}
              </Typography>
              <Hidden xsDown>
                <Typography>{option}</Typography>
              </Hidden>
              <Hidden smUp>
                <Typography color='textSecondary'>{option}</Typography>
              </Hidden>
            </div>
          ))
        }
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  )
};

const NameBioSection = ({ user }) => {
  const classes = useProfilePageStyles();

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{user.name}</Typography>
      <Typography>{user.bio}</Typography>
      <a href={user.website} target='_blank' rel='noopener noreferrer'>
        <Typography color='secondary' className={classes.typography}>{user.website}</Typography>
      </a>
    </section>
  )
};

const OptionsMenu = ({ handleCloseMenu }) => {
  const classes = useProfilePageStyles();
  const { signOut } = React.useContext(AuthContext); 
  const [showLogOutMessage, setLogOutMessage] = React.useState(false);
  const history = useHistory();

  const handleLogOutClick = () => {
    setLogOutMessage(true);
    signOut();
    setTimeout(() => {
      history.push('/accounts/login');
    }, 2000);
  };

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.dialogPaper
      }}
      TransitionComponent={Zoom}
    >
      {showLogOutMessage ? (
        <DialogTitle className={classes.dialogTitle}>
          Logging Out
          <Typography color='textSecondary'>
            You need to log back in to continue using Instagram
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsMenuItem text='Change Password' />
          <OptionsMenuItem text='Nametag' />
          <OptionsMenuItem text='Authorized apps' />
          <OptionsMenuItem text='Notifications' />
          <OptionsMenuItem text='Privacy and security' />
          <OptionsMenuItem text='Log Out' onClick={handleLogOutClick} />
          <OptionsMenuItem text='Cancel' onClick={handleCloseMenu} />
        </>
      )}
    </Dialog>
  )
};

const OptionsMenuItem = ({ text, onClick }) => {
  return (
    <>  
      <Button style={{ padding: '12px 8px' }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  )
};

export default ProfilePage;
