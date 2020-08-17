import React from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { Typography } from '@material-ui/core'
import { LoadingLargeIcon } from '../../icons';
import { getDefaultPost, defaultUser } from '../../data';
import GridPost from '../shared/GridPost'
import { Link } from 'react-router-dom';


const MorePostsFromUser = () => {
  const classes = useMorePostsFromUserStyles();
  const [isLoading] = React.useState(false);

  return (
    <div className={classes.container}>
      <Typography
        color='textSecondary'
        variant='subtitle2'
        component='h2'
        gutterBottom
        className={classes.typography}
      >
        More posts from {" "}
        <Link to={`/${defaultUser.username}`} className={classes.link}>
          @{defaultUser.username}
        </Link>
      </Typography>
      {
        isLoading ? (
          <LoadingLargeIcon />
        ) : (
          <article className={classes.article}>
            <div className={classes.postContainer}>
              {
                Array.from({length: 6}, () => getDefaultPost()).map(post => (
                  <GridPost key={post.id} post={post} />
                ))
              }
            </div>
          </article>
        )
      }
    </div>
  )
}

export default MorePostsFromUser;
