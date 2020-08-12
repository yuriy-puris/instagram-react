import React from "react";
import { useExploreSuggestionsStyles } from "../../styles";
import { Hidden, Typography } from "@material-ui/core";
import FollowSuggestions from '../shared/FollowSuggestions';


const ExploreSuggestions = () => {
  const classes = useExploreSuggestionsStyles();

  return (
    <Hidden xsDown>
      <div className={classes.container}>
        <Typography
          color="textSecondary"
          variant='subtitle2'
          component='h2'
          className={classes.typography}
        >
          Discover people
        </Typography>
        <FollowSuggestions hideHeader />
      </div>
    </Hidden>
  );
}

export default ExploreSuggestions;
