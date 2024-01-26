import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Box, Card, CardActions } from '@material-ui/core';
import _ from 'lodash'

import { Formik, Form, Field } from 'formik';

import { TextField } from 'formik-material-ui';
import { withSnackbar } from 'notistack';
import UserService from 'services/repo/UserService';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    display: 'flex'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));



function UpdatePassword(props) {
  const classes = useStyles();

  async function handleSubmit(values, { setSubmitting, setErrors }) {
    console.log(values);
    try {
      await UserService.updatePassword(values)
      setSubmitting(false);
      props.enqueueSnackbar('Password updated successfully',
        {
          variant: 'success',
        });
    } catch (error) {
      props.enqueueSnackbar(`Please enter the correct old password`,
        {
          variant: 'error',
        });
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Box pl={8} pt={8} pr={8} pb={8}>
        <Card className={classes.root}>
          <Formik
            validate={values => {
              let errors = {};
              return errors;
            }}
            initialValues={{ old_password: '', password: '' }}
          onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      margin="normal"
                      fullWidth
                      label="Old Password"
                      name="old_password"
                      margin='dense'
                      type="password"
                      variant="outlined"
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      margin="normal"
                      fullWidth
                      label="New Password"
                      name="password"
                      margin='dense'
                      type="password"
                      variant="outlined"
                      component={TextField}
                    />
                  </Grid>
                </Grid>
                <CardActions>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Update
                    </Button>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Box>
    </div>
  );
}
export default withSnackbar(UpdatePassword)

