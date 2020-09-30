import React from "react";
import { useLoginPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
  InputAdornment
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { AuthContext } from '../auth';
import isEmail from 'validator/lib/isEmail';
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from './signup';

function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState } = useForm({ mode: 'onBlur' });
  const [showPassword, setPasswordVisibility] = React.useState(false);
  const hasPassword = Boolean(watch('password'));
  const {signInWithEmailAndPassword} = React.useContext(AuthContext);
  const history = useHistory();
  const client = useApolloClient();
  const [error, setError] = React.useState('');
  
  const togglePasswordVisibility = () => {
    setPasswordVisibility(prev => !prev);
  };

  const onSubmit = async ({ input, password }) => {
    try {
      setError('');
      if ( !isEmail(input) ) {
        input = await getUserEmail(input);
      }
      await signInWithEmailAndPassword(input, password);
      setTimeout(() => { history.push('/') }, 0);
    } catch (error) {
      console.log('Error message', error);
      handlerError(error);
    }
  };

  const handlerError = error => {
    if (error.code.include('auth')) {
      setError(error.message);
    }
  };

  const getUserEmail = async input => {
    const variables = { input };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables
    });
    const userEmail = response.data.users[0]?.emal || "no@email.com";
    return userEmail;
  };

  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={ handleSubmit(onSubmit) }>
              <TextField
                name="input"
                inputRef={
                  register({
                    required: true,
                    minLength: 5
                  })
                }
                fullWidth
                variant="filled"
                label="Username, email or phone"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                inputRef={
                  register({
                    required: true,
                    minLength: 5
                  })
                }
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment>
                      <Button onClick={togglePasswordVisibility}>{ showPassword ? 'Hide' : 'Show' }</Button>
                    </InputAdornment>
                  )
                }}
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                type={ showPassword ? 'text' : 'password' }
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Log In
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <AuthError error={error} />
            <Button fullWidth color="secondary">
              <Typography variant="caption">Forgot password?</Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Don't have an account?
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.signUpButton}>
                Sign up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const { signInWithGoogle } = React.useContext(AuthContext);
  const [error, setError] = React.useState('');
  const history = useHistory();
  const facebookIcon =
    iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;

  const handleSignInWithGoogle = async () => {
    try {
      setError('');
      await signInWithGoogle();
      setTimeout(() => history.push('/'), 0);
    } catch (error) {
      console.error('Error logging whit google', error);
      setError(error.message);
    }
  };

  return (
    <>
      <Button onClick={handleSignInWithGoogle} fullWidth color={color} variant={variant}>
        <img
          src={facebookIcon}
          alt="facebook icon"
          className={classes.facebookIcon}
        />
        Log In with Facebook
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
