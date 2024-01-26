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
import StaffUserService from 'services/repo/StaffUserService';


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

function EditStaffUser({ data,sdata,...props }) {
  const history = useHistory();

  function handleSubmit(values, { setSubmitting, setErrors }) {
    console.log(values);
    let newValues = { ...values }
    StaffUserService.update(newValues).then(res => {
      setSubmitting(false);
      data.refresh();
      props.setOpen(false)
      props.enqueueSnackbar('Staff User updated Successfully', {
        variant: 'success'
      });
    })
      .catch(err => {
        setSubmitting(false);
        console.log(err.response);
        if (_.get(err, 'response.status') === 400) {
          handle400Error(err, setErrors);
          return;
        }

        if (_.get(err, 'response.status') === 422) {
          props.enqueueSnackbar(_.get(err, 'response.data.message',
            'Cannot create user due to server error!'), {
            variant: 'error'
          });
        }
      });
  }

  return (
    <div>
      <Formik
        onSubmit={handleSubmit}
        initialValues={
          sdata
        }
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
                  <MyTextField name='mobile' label='Phone' />
                </Grid>

                <Grid item xs={12}>
                  <MyTextField name='password' label='Password' />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type='submit'
                    color='primary'
                    variant='contained'>
                    Update User
                        </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}></Formik>
    </div>
  );
}

export default withSnackbar(EditStaffUser);
