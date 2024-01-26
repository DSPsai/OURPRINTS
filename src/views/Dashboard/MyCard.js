import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Skeleton from '@material-ui/lab/Skeleton';
import { Add } from '@material-ui/icons'
const useStyles = makeStyles(theme => ({
  root: {
    height: '50%'
  },
  card: {
    margin: 'auto',
    transition: '0.1s',
    // boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    // '&:hover': {
    //   boxShadow: '0 16px 50px -1.125px rgba(0,0,0,0.3)'
    // }
  },
  cardicon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    fontSize: 40,
    color: '#43425C'
  },
  avatar: {
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    marginRight: theme.spacing(1),
    fontWeight: 500,
    fontSize: 14
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 20,
    height: 20
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function MyListCard({ title, icon, value, ...props }) {
  const classes = useStyles();




  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={1} justify='space-between'>
          <Grid xs={12} item >
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4' color='primary'>
              {value}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              {title}

            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MyListCard;
