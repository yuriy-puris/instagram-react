import React from "react";
import { useHistory } from 'react-router-dom';
import { useSignUpPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import { Card, Typography, TextField, Button, InputAdornment } from "@material-ui/core";
import { LoginWithFacebook } from "./login";
import { Link } from "react-router-dom";
import { AuthContext } from '../auth';
import { useForm } from 'react-hook-form';
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons';
import isEmail from 'validator/lib/isEmail';
import { useApolloClient } from "@apollo/react-hooks";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit, formState, errors } = useForm({ mode: 'onBlur' });
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = React.useState('');
  const client = useApolloClient();

  const onSubmit = async data => {
    try {
      setError('');
      await signUpWithEmailAndPassword(data);
      setTimeout(() => history.push('/'), 0);
    } catch (error) {
      handleError(error);
      console.error('Error sign up', error);
    }
  };

  const handleError = error => {
    if ( error.message.include('users_username_key') ) {
      setError(' Username already taken');
    } else if (error.code.include('auth')) {
      setError(error.message);
    }
  };

  const validateUserName = async username => {
    const variables = { username };
    const response = await client.query({
      query: CHECK_IF_USERNAME_TAKEN,
      variables
    });
    const isUserNameValid = response.data.users.length === 0;
    return isUserNameValid;
  };

  const errorIcon = (
    <InputAdornment>
      <HighlightOff style={{ color: 'red', height: 30, width: 30 }} />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline style={{ color: '#ccc', height: 30, width: 30 }} />
    </InputAdornment>
  );

  return (
    <>
      <SEO title="Sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <div className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
                inputRef={
                  register({
                    required: true,
                    validate: input => isEmail(input)
                  })
                }
                InputProps={{
                  endAdornment: errors.email ? errorIcon : formState.touched.email && validIcon
                }}
              />
              <TextField
                name="name"
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
                inputRef={
                  register({
                    required: true,
                    minLength: 5,
                    maxLength: 20,
                    pattern: /^[a-zA-Z0-9_.]*$/
                  })
                }
                InputProps={{
                  endAdornment: errors.name ? errorIcon : formState.touched.name && validIcon
                }}
              />
              <TextField
                name="username"
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                inputRef={
                  register({
                    required: true,
                    minLength: 5,
                    maxLength: 20,
                    pattern: /^[a-zA-Z0-9_.]*$/,
                    validate: async input => await validateUserName(input)
                  })
                }
                InputProps={{
                  endAdornment: errors.username ? errorIcon : formState.touched.username && validIcon
                }}
              />
              <TextField
                name="password"
                fullWidth
                variant="filled"
                label="Password"
                type="password"
                margin="dense"
                className={classes.textField}
                autoComplete="new-password"
                inputRef={
                  register({
                    required: true,
                    minLength: 5
                  })
                }
                InputProps={{
                  endAdornment: errors.password ? errorIcon : formState.touched.password && validIcon
                }}
              />
              <Button
                disabled={ !formState.isValid || formState.isSubmitting }
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
};

export const AuthError = ({ error }) => {
  return Boolean(error) && (
    <Typography
      align='center'
      gutterBottom
      variant='body2'
      style={{ color: 'red' }}
    >
      { error }
    </Typography>
  )
};

export default SignUpPage;
