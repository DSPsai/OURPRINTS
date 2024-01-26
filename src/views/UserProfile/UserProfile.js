import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tabs, Tab } from '@material-ui/core';
// import Box from '@mui/material/Box';
import Profile from './Profile';
import UserDetails from './UserDetails';
import CoinHistory from './CoinHistory';
import { useRouteMatch, Link } from 'react-router-dom';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import BackButton from 'components/BackButton'
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        {children}
      )}
    </div>
  );
}

const UserProfile = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const match = useRouteMatch('/user/:id');
  const user = useAsyncDataFrom(() => UserService.getById(match.params.id))

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <BackButton path='/users'/>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label='profile' />
            <Tab label='coin history' />
          </Tabs>
          {value == 0 &&
            <UserDetails data={user.data} />
          }
          {value == 1 &&
            <CoinHistory data={user.data}/>
          }

        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Profile data={user.data} />
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfile;
