import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import CustomComponent from 'views/Orders/OrderPage/CustomComponent'
import FormattedDate from 'components/FormattedDate';
const useStyles = makeStyles(() => ({
  root: {}
}));

const UserDetails = props => {
  const { className, data, ...rest } = props;
  const { coin_balance = [] } = data;

  const classes = useStyles();

  const [values, setValues] = useState({});


  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  let years = moment(new Date()).diff(
    moment(data.dob),
    'years'
  );

  const coinBalance = (coin_balance.length > 0) ? coin_balance[0].balance : 0

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          title="Profile"
        />

        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <CustomComponent
              size={6}
              title="First Name"
              value={data.first_name}
            />
            <CustomComponent
              size={6}

              title="Last Name"
              value={data.last_name}
            />
            <CustomComponent
              size={6}

              title="Mobile"
              value={data.mobile}
            />
            <CustomComponent
              size={6}

              title="Email"
              value={data.email}
            />
            <CustomComponent
              size={6}

              title="Gender"
              value={data.gender}
            />
            <CustomComponent
              size={6}

              title="Date of birth"
              value={<FormattedDate date={data.dob} />}
            />
            <CustomComponent
              size={6}

              title="Age"
              value={years}
            />
            <CustomComponent
              size={6}

              title="College Name"
              value={data.college_name}
            />
            <CustomComponent
              size={6}

              title="Branch"
              value={data.branch}
            />
            <CustomComponent
              size={6}

              title="Course"
              value={data.course}
            />
            <CustomComponent
              size={6}

              title="Year"
              value={data.year}
            />
            <CustomComponent
              size={6}
              title="Semester"
              value={data.sem}
            />
            <CustomComponent
              size={6}
              title="Coin Balance"
              value={coinBalance}
            />


          </Grid>

        </CardContent>
        {/* <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </CardActions> */}
      </form>
    </Card>
  );
};

UserDetails.propTypes = {
  className: PropTypes.string
};

export default UserDetails;
