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
  TextField
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";

const EditProfilePage = ({ history }) => {
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showDrawer, setDrawer] = React.useState(false);

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
          {path.includes("edit") && <EditUserInfo user={defaultCurrentUser} />}
        </main>
      </section>
    </Layout>
  );
};

const EditUserInfo = ({ user }) => {
  const classes = useEditProfilePageStyles();

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} user={user} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            { user.username }
          </Typography>
          <Typography 
            color='primary'
            variant='body2'
            className={classes.typographyChangePic}>
            Change profile photos
          </Typography>
        </div>
      </div>
      <form className={classes.form}>
        <SectionItem text='Name' formItem={user.name} />
        <SectionItem text='Username' formItem={user.username} />
        <SectionItem text='Website' formItem={user.website} />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField 
            variant='outlined'
            multiline
            fullWidth
            rowsMax={3}
            rows={3}
            value={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography color='textSecondary' className={classes.justifySelfStart}>
            Personal information
          </Typography>
        </div>
        <SectionItem text='Email' formItem={user.email} />
        <SectionItem text='Phone Number' formItem={user.phone_number} />
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
    </section>
  )
};

const SectionItem = ({ type='text', text, formItem }) => {
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
        variant='outlined'
        fullWidth
        type={type}
        value={formItem}
        className={classes.textFieldInput}
        inputProps={{
          className: classes.textFieldInput
        }}
      />
    </div>
  )
};

export default EditProfilePage;
