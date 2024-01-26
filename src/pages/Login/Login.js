import React from 'react';
import { Form, Formik, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '../../components/formFields/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import _ from 'lodash';
import handle400Error from '../../helpers/handle400Error';
import * as Yup from 'yup';
import PassWordField from '../../components/formFields/PasswordField';
import logo from '../../icons/app_logo.png';
import AuthService from '../../services/repo/AuthService';
import { withSnackbar } from 'notistack';
import { toast } from 'react-toastify';

function Login(props) {
  function handleSubmit(values, { setErrors }) {
    AuthService
      .login(values)
      .then(res => {
        console.log(res.data)
        localStorage.setItem('token', `Token ${res.data.token}`);
        localStorage.setItem('id', `${res.data.user.id}`);
        window.location.href = '/';
      })
      .catch(err => {
        if (_.get(err, 'response.status') === 400) {
          handle400Error(err, setErrors);
          toast.error("Wrong Credentials")
          return;
        }
        if (_.get(err, 'response.status') === 422) {
          console.log(_.get(err, 'response.data'))
          props.enqueueSnackbar(_.get(err, 'response.data.error'), {
            variant: 'error'
          });
        }
        if (_.get(err, 'response.status') === 500) {
          toast.error("Internal Server Error")
          return
        }
        toast.error("Login Failed")
        console.log(err);
      });
  }

  return (
    <Box>
      <Grid
        style={{ height: '80vh' }}
        container
        justify='center'
        alignItems='center'>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper>
            <Box padding={5}>
              <Box textAlign='center'>
                <img src={logo} width='25%' alt='' />
                <Typography variant='h6' color='textSecondary'>
                  Sign In
                </Typography>
              </Box>
              <Formik
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={Yup.object({
                  email: Yup.string().required('This field is Required'),
                  password: Yup.string().required('This field is Required')
                })}
                onSubmit={handleSubmit}>
                {({ values }) => (
                  <Form>
                    <Box mt={2}>
                      <TextField
                        name='email'
                        type='email'
                        label='Email'
                        variant='outlined'
                        fullWidth
                      />
                    </Box>
                    <Box mt={2}>
                      <PassWordField
                        name='password'
                        label='Password' />
                    </Box>
                    <Box mt={2}>
                      <Button
                        fullWidth
                        width='100%'
                        size='large'
                        type='submit'
                        color='primary'
                        variant='contained'>
                        Login
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default withSnackbar(Login);
