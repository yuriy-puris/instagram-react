import React from "react";
import { useProfileTabsStyles } from "../../styles";
import {
  Hidden,
  Tabs,
  Tab,
  Divider,
  Typography,
} from "@material-ui/core";
import { GridIcon, SaveIcon } from "../../icons";
import GridPost from '../shared/GridPost';

function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [value, setValue] = React.useState(0);

  return (
    <>
      <section className={classes.section}>
        <Hidden xsDown>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              icon={<span className={classes.postIconLarge} />}
              label='POSTS'
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLableIcon,
                wrapper: classes.tabWrapper
              }}
            />
            {isOwner && (
              <Tab
                icon={<span className={classes.savedIconLarge} />}
                label='SAVED'
                classes={{
                  root: classes.tabRoot,
                  labelIcon: classes.tabLableIcon,
                  wrapper: classes.tabWrapper
                }}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>
        <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              icon={<GridIcon fill={value === 0 ? '#3897f0' : undefined} />}
              classes={{
                root: classes.tabRoot,
              }}
            />
            {isOwner && (
              <Tab
              icon={<SaveIcon fill={value === 1 ? '#3897f0' : undefined} />}
                classes={{
                  root: classes.tabRoot,
                }}
              />
            )}
        </Tabs>
        </Hidden>
        <Hidden smUp>
          {user.posts.length === 0 && <Divider />}
        </Hidden>
        { value === 0 && <ProfilePosts user={user} isOwner={isOwner} /> }
        { value === 1 && <SavedPosts user={user} /> }
      </section>
    </>
  )
};

const ProfilePosts = ({ user, isOwner }) => {
  const classes = useProfileTabsStyles();

  if ( user.posts.length === 0 ) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.uploadPhotoIcon} />
          <Typography>
            { isOwner? 'Upload a photo' : 'No photos' }
          </Typography>
        </div>
      </section>
    )
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {
          user.posts.map(post => (
            <GridPost key={post.id} post={post} />
          ))
        }
      </div>  
    </article>
  )
};  

const SavedPosts = ({ user }) => {
  const classes = useProfileTabsStyles();

  if ( user.saved_posts.length === 0 ) {
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <div className={classes.savePhotoIcon} />
          <Typography variant='h4'>
            Save
          </Typography>
          <Typography align='center'>
            Save your photo and videos that you want to see again.
          </Typography>
        </div>
      </section>
    )
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {
          user.saved_posts.map(({ post }) => (
            <GridPost key={post.id} post={post} />
          ))
        }
      </div>  
    </article>
  )
};


export default ProfileTabs;
