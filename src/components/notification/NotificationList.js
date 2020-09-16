import React from "react";
import { useNotificationListStyles } from "../../styles";
import { Grid, Avatar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FollowButton from '../shared/FollowButton';
import useOutsideClick from '@rooks/use-outside-click';
import { CHECK_NOTIFICATION } from '../../graphql/mutations';
import { useMutation } from "@apollo/react-hooks";
import { formatDateToNowShort } from '../../utils/formateDate'; 

function NotificationList({ handleHideList, notifications, currentUserId }) {
  const classes = useNotificationListStyles();
  const listContainerRef = React.useRef();
  useOutsideClick(listContainerRef, handleHideList);
  const [checkNotification] = useMutation(CHECK_NOTIFICATION);
  
  React.useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString(),
    };
    checkNotification({ variables });
  }, [currentUserId, checkNotification]);
  

  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {
        notifications.map(notification => {
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
                    { isLike && `likes your photo ${formatDateToNowShort(notification.created_at)}` }
                    { isFollow && `started following you ${formatDateToNowShort(notification.created_at)}` }
                  </Typography>
                </div>
              </div>
              {isLike && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt="post cover" />
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id}/>}
            </Grid>
          )
        })
      }
    </Grid>
  );
}

export default NotificationList;
