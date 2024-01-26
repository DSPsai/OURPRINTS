import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { Formik, Form } from 'formik';
import { withSnackbar } from 'notistack';
import { Button, MenuItem, LinearProgress } from '@material-ui/core';
import TextField from 'components/formFields/TextField';
import handle400Error from 'helpers/handle400Error';
import { useHistory } from 'react-router-dom';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import * as Yup from 'yup';

function MyTextField({ label, name, type, ...props }) {
  return (
    <TextField
      name={name}
      margin={'dense'}
      fullWidth
      variant='outlined'
      label={label}
      type={type}
      {...props}
    />
  );
}

function CreateStaffUser(props) {
  const history = useHistory();

  function handleSubmit(values, { setSubmitting, setErrors }) {
    console.log(values);
    let newValues = { ...values }
    newValues.username = values.mobile
    newValues.first_name = values.full_name
    newValues.last_name = ""
    UserService.staffUserCreate(newValues).then(res => {
      setSubmitting(false);
      props.setOpen(false)
      props.data.refresh();
      props.enqueueSnackbar('Staff User Created Successfully', {
        variant: 'success'
      });
    })
      .catch(error => {
        setSubmitting(false);
        if (_.get(error, 'response.status') === 400) {
          let errorsObj = _.get(error, 'response.data', null);
          if (!errorsObj) {
            return;
          }
          console.log(errorsObj);
          setErrors(errorsObj);
          return;
        }
        if (_.get(error, 'response.status') === 500) {
          console.log(_.get(error, 'response.data'))
          props.enqueueSnackbar(_.get(error, 'response.data'), {
            variant: 'error'
          });
        }
        if (_.get(error, 'response.status') === 422) {
          console.log(_.get(error, 'response.data'))
          props.enqueueSnackbar(_.get(error, 'response.data.error'), {
            variant: 'error'
          });
        }
      });
  }

  return (
    <div>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          full_name: '',
          email: '',
          password: '',
          mobile: '',
          is_staff: true,
          username: null
        }}
        validationSchema={Yup.object({
          full_name: Yup.string().required('This field is Required'),
          email: Yup.string().required('This field is Required'),
          password: Yup.string().required('This field is Required'),
          mobile: Yup.string().required('This field is Required')

        })}
        render={({ values, isSubmitting, setFieldValue }) => {
          return (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MyTextField name='full_name' label='Full Name' />
                </Grid>

                <Grid item xs={12}>
                  <MyTextField name='email' label='Email' />
                </Grid>

                <Grid item xs={12}>
                  <MyTextField name='mobile' label='Phone'  />
                </Grid>

                <Grid item xs={12}>
                  <MyTextField
                    type='password'
                    name='password'
                    label='Password'
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type='submit'
                    color='primary'
                    variant='contained'>
                    Create User
                        </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}></Formik>
    </div>
  );
}

export default withSnackbar(CreateStaffUser);
