import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress,
  Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, data, ...rest } = props;

  const classes = useStyles();
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div>
          <Grid container justify='center' style={{textAlign:'center'}}>
            <Grid item>
              <Avatar
                className={classes.avatar}
                src={data.image}
              />
              <Typography
                gutterBottom
                variant="h5"
              >
                {data.first_name}
              </Typography>
              <Divider />
              <Button
                color='primary'
                variant="text">
                {data.is_staff == true
                  ? 'Staff user'
                  : (data.is_student == true ? 'Student' : 'Not student')}
              </Button>
            </Grid>
          </Grid >
        </div>
      </CardContent>
    </Card>
  );
};


export default AccountProfile;
