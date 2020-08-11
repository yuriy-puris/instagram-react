import React from "react";
import { useNavbarStyles, WhiteTooltip, RedTooltip } from "../../styles";
import { 
  AppBar,
  Hidden,
  InputBase,
  Avatar,
  Typography,
  Grid,
  Fade,
  Zoom,
 } from "@material-ui/core";
import NotificationTooltip from '../notification/NotificationTooltip';
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import { LoadingIcon, AddIcon, LikeIcon, LikeActiveIcon, ExploreIcon, ExploreActiveIcon, HomeIcon, HomeActiveIcon } from '../../icons';
import { defaultCurrentUser, getDefaultPost } from '../../data';
import NotificationList from "../notification/NotificationList";
import { useNProgress } from '@tanem/react-nprogress';


function Navbar({ minimalNavbar }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;
  const [isLoadingPage, setLoadingPage] = React.useState(true);

  React.useEffect(() => {
    setLoadingPage(false);
  }, [path]);

  return (
    <>
      <Progress isAnimating={isLoadingPage} />
      <AppBar className={classes.appBar}>
        <section className={classes.section}>
          <Logo />
          {!minimalNavbar && 
            <>
              <Search history={history} />
              <Links path={path} />
            </>
          }
        </section>
      </AppBar>
    </>
  );
}

const Logo = () => {
  const classes = useNavbarStyles();

  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <div className={classes.logoWrapper}>
          <img src={logo} alt="Instagram" className={classes.logo} />
        </div>
      </Link>
    </div>
  );
};

const Search = ({ history }) => {
  const classes = useNavbarStyles();
  const [loading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  const handlerClearInput = () => {
    setQuery('');
  };

  const hasResults = Boolean(query) && results.length > 0;

  React.useEffect(() => {
    if (!query.trim) return;
    setResults(Array.from({ length: 5 }, () => getDefaultPost()));
  }, [query]);

  return (
    <Hidden xsDown>
      <WhiteTooltip
        arrow
        interactive
        TransitionComponent={Fade}
        title={
          hasResults && (
            <Grid className={classes.resultContainer} container>
              { results.map(result => (
                <Grid
                  key={result.id}
                  item
                  className={classes.resultLink}
                  onClick={() => {
                    history.push(`${result.user.username}`)
                    handlerClearInput()
                  }}
                >
                  <div className={classes.resultWrapper}>
                    <div className={classes.avatarWrapper}>
                      <Avatar src={result.user.profile_image} alt="user avatar" />
                    </div>
                    <div className={classes.nameWrapper}>
                      <Typography variant="body1">
                        {result.user.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.user.username}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              )) }
            </Grid>
          )
        }
      >
        <InputBase 
          className={classes.input}
          onChange={event => setQuery(event.target.value)}
          startAdornment={<span className={classes.searchIcon} />}
          endAdornment={
            loading ? (
              <LoadingIcon />
            ) : (
              <span onClick={handlerClearInput} className={classes.searchIcon} />
            )
          }
          value={query}
          placeholder='Search'
        />
      </WhiteTooltip>
    </Hidden>
  )
};

const Links = ({ path }) => {
  const classes = useNavbarStyles();
  const [showList, setList] = React.useState(false);
  const [showTooltip, setTooltip] = React.useState(true);

  const handlerToggleList = () => {
    setList(prev => !prev);
  };

  const handleHideTooltip = () => {
    setTooltip(false);
  };

  const handleHideList = () => {
    setList(false);
  };

  React.useEffect(() => {
    const timeout = setTimeout(handleHideTooltip, 5000);
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  return (
    <div className={classes.linksContainer}>
      { showList && <NotificationList handleHideList={handleHideList} /> }
      <div className={classes.linksWrapper}>
        <Hidden xsDown>
          <AddIcon  />
        </Hidden>
        <Link to="/">
          { path === '/' ? <HomeActiveIcon /> : <HomeIcon /> }
        </Link>
        <Link to="/explore">
          { path === '/explore' ? <ExploreActiveIcon /> : <ExploreIcon /> }
        </Link>
        <RedTooltip
          arrow
          open={showTooltip}
          onOpen={handleHideTooltip}
          TransitionComponent={Zoom}
          title={
            <NotificationTooltip />
          }
        >
          <div className={classes.notification} onClick={handlerToggleList}>
            { showList ? <LikeActiveIcon /> : <LikeIcon /> }
          </div>
        </RedTooltip>
        <Link to={`${defaultCurrentUser.username}`}>
          <div className={path === `/${defaultCurrentUser.username}` ? classes.profileActive : ""}></div>
          <Avatar 
            src={defaultCurrentUser.profile_image}
            className={classes.profileImage}
          />
        </Link>
      </div>
    </div>
  )
};

const Progress = ({ isAnimating }) => {
  const classes = useNavbarStyles();
  const { animationDuration, isFinished, progress } = useNProgress({ isAnimating });

  return (
    <div className={classes.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${ animationDuration }ms linear`
      }}
    >
      <div className={classes.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`
        }}
      >
        <div className={classes.progressBackground} />
      </div>
    </div>
  )
};

export default Navbar;
