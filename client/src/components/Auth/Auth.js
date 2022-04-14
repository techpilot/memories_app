import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Paper, Grid, Typography, Container } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { GoogleLogin } from "react-google-login";

import useStyles from "./styles";
import Input from './Input';
import Icon from './Icon';
import { signup, signin } from "../../actions/auth"

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch();
  const history = useHistory();

  // handles the show password functionality
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  // handles form submission for login and signup
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
      console.log(formData);
    }
  };
  
  // handles the form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
  
  // handles toggling of the show password functionality
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false)
  };

  // google login auth successful
  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: 'AUTH', payload: { result, token } });

      history.push("/");
    } catch (error) {}
  }

  // google login auth failed
  const googleFailure = () => {
    console.log("Google Sign In was unsuccessful. Try Again Later")
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
              </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? "Sign up" : "Sign in"}
          </Button>
          <GoogleLogin
            clientId='726272780874-620kb31dq1kogkcoqqb333sc3gsn8j96.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Sign in with google
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? "Already have an account? sign in": "Don't have an account? Sign up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth