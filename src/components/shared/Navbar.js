import React from "react";
import { useNavbarStyles, WhiteTooltip } from "../../styles";
import { 
  AppBar,
  Hidden,
  InputBase,
  Avatar,
 } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import { LoadingIcon, AddIcon, LikeIcon, LikeActiveIcon, ExploreIcon, ExploreActiveIcon, HomeIcon, HomeActiveIcon } from '../../icons';
import { defaultCurrentUser, getDefaultPost } from '../../data';


function Navbar({ minimalNavbar }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;

  return (
    <AppBar className={classes.appBar}>
      <section className={classes.section}>
        <Logo />
        {!minimalNavbar && 
          <>
            <Search />
            <Links path={path} />
          </>
        }
      </section>
    </AppBar>
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

const Search = () => {
  const classes = useNavbarStyles();
  const [loading, setLoading] = React.useState(false);
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
    </Hidden>
  )
};

const Links = ({ path }) => {
  const classes = useNavbarStyles();
  const [showList, setList] = React.useState('');

  const handlerToggleList = () => {
    setList(prev => !prev);
  };

  return (
    <div className={classes.linksContainer}>
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
        <div className={classes.notification} onClick={handlerToggleList}>
          { showList ? <LikeActiveIcon /> : <LikeIcon /> }
        </div>
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



export default Navbar;
