import React from "react";
import { useNotificationListStyles } from "../../styles";
import { defaultNotifications } from '../../data';
import { Grid, Avatar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FollowButton from '../shared/FollowButton';
import useOutsideClick from '@rooks/use-outside-click';

function NotificationList({ handleHideList }) {
  const classes = useNotificationListStyles();
  const listContainerRef = React.useRef();

  useOutsideClick(listContainerRef, handleHideList);

  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {
        defaultNotifications.map(notification => {
          const isLike = notification.type === 'like';
          const isFollow = notification.type === 'follow';

          return (
            <Grid key={notification.id} item className={classes.listItem}>
              <div className={classes.listItemWrapper}>
                <div className={classes.avatarWrapper}>
                  <Avatar 
                    src={notification.user.profile_image}
                    alt="avatar"
                  />
                </div>
                <div className={classes.nameWrapper}>
                  <Link to={`${notification.user.username}`}>
                    <Typography>
                      { notification.user.username }
                    </Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className={classes.typography}
                  >
                    { isLike && `likes your photo 4d` }
                    { isFollow && `started following you` }
                  </Typography>
                </div>
              </div>
              {isLike && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt="post cover" />
                </Link>
              )}
              {isFollow && <FollowButton />}
            </Grid>
          )
        })
      }
    </Grid>
  );
}

export default NotificationList;
