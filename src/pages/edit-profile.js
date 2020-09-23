import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import {
  IconButton,
  Button,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField, Snackbar, Slide
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from '../App';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from '../graphql/queries';
import { EDIT_USER, EDIT_USER_AVATAR } from '../graphql/mutations';
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from 'react-hook-form';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";


const DEFAULT_ERROR = { type: '', message: '' };

const EditProfilePage = ({ history }) => {
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showDrawer, setDrawer] = React.useState(false);

  if ( loading ) return <LoadingScreen />;

  const handleToggleDrawer = () => {
    setDrawer(prev => !prev);
  };

  const handleSelected = index => {
    switch(index) {
      case 0:
        return path.includes('edit');
      default:
        break;
    }
  };

  const handleListClick = index => {
    switch(index) {
      case 0:
        history.push('/accounts/edit');
        break;
      default:
        break;
    }
  };

  const options = [
    'Edit profile',
    'Change Password',
    'Apps and Websites',
    'Email and SMS',
    'Push Notifications',
    'Manage Contacts',
    'Privacy and Security',
    'Login Activity',
    'Emails from Instagram'
  ];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  )


  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
};

const EditUserInfo = ({ user }) => {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: 'onBlur' });
  const [editUser] = useMutation(EDIT_USER);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const { updateEmail } = React.useContext(AuthContext);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(user.profile_image);

  const onSubmit = async data => {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.emal);
      variables.emal = data.emal;
      delete variables.email;
      await editUser({ variables });
      setOpen(true);
    } catch (error) {
      console.log('Error updating profile', error);
      handleError(error);
    }
  };

  const handleError = error => {
    if ( error.message.include('users_username_key') ) {
      setError({ type: 'username', message: 'Username already taken'});
    } else if (error.code.include('auth')) {
      setError({ type: 'email', message: error.message});
    }
  };

  const handleUpdateProfilePic = async event => {
    const url = await handleImageUpload(event.target.files[0], 'instagram-avatar');
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  };


  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            { user.username }
          </Typography>
          <input 
            type="file"
            accept='image/*'
            id='image'
            style={{ display: 'none' }}
            onChange={handleUpdateProfilePic}  
          />
          <label htmlFor="image">
            <Typography 
              color='primary'
              variant='body2'
              className={classes.typographyChangePic}>
              Change profile photos
            </Typography>
          </label>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)} 
        className={classes.form}>
        <SectionItem 
          name='name'
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20
          })}
          text='Name' 
          formItem={user.name} />
        <SectionItem
          error={error}
          name='username'
          inputRef={register({
            required: true,
            pattern: /^[a-zA-Z0-9_.]*$/,
            minLength: 5,
            maxLength: 20
          })} 
          text='Username' 
          formItem={user.username} />
        <SectionItem
          name='website'
          inputRef={register({
            validate: input => Boolean(input) ? isURL(input, {
              protocols: ['http', 'https'],
              required_protocol: true
            }) : true
          })} 
          text='Website' 
          formItem={user.website} />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField
            name='bio'
            inputRef={register({
              maxLength: 120
            })} 
            variant='outlined'
            multiline
            fullWidth
            rowsMax={3}
            rows={3}
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography color='textSecondary' className={classes.justifySelfStart}>
            Personal information
          </Typography>
        </div>
        <SectionItem
          error={error}
          name='emal'
          inputRef={register({
            required: true,
            validate: input => isEmail(input)
          })} 
          text='Email' 
          formItem={user.emal} />
        <SectionItem
          name='phoneNumber'
          inputRef={register({
            required: false,
            validate: input => Boolean(input) ? isMobilePhone(input) : true
          })}  
          text='Phone Number' 
          formItem={user.phone_number} />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.justifySelfCenter}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar 
        open={open}
        autoHideDuration={6000}
        message={<span>Profile updated</span>}
        TransitionComponent={Slide}
        onClose={() => setOpen(false)}
      />
    </section>
  )
};

const SectionItem = ({ type='text', text, formItem, inputRef, name, error }) => {
  const classes = useEditProfilePageStyles();
  
  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align='right'>
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>
            {text}
          </Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        inputRef={inputRef}
        variant='outlined'
        fullWidth
        type={type}
        defaultValue={formItem}
        className={classes.textFieldInput}
        inputProps={{
          className: classes.textFieldInput
        }}
        helperText={error?.type === name && error.message}
      />
    </div>
  )
};

export default EditProfilePage;
