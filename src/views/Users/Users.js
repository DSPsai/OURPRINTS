import React from 'react';
import { useHistory } from 'react-router-dom';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import MaterialTable from 'material-table';
import { Box, Avatar, Typography, Grid, Button } from '@material-ui/core';
import images from '../../images/user.png';
import _ from 'lodash';
import { CSVLink } from "react-csv";
import FormattedDate from 'components/FormattedDate';
import moment from 'moment';


const coloumns = [
  {
    title: 'S.NO',
    field: 's.no',
    render: d => d.index + 1,
    filtering: false,
    export: false
  },
  {
    title: 'Full Name', field: 'first_name'
  },
  { title: 'Mobile', field: 'mobile' },
  {
    title: 'DOB(age)', field: 'age', render: user => (<Grid container>
      <Grid item>
        <FormattedDate date={user.dob} />
      </Grid>
      <Grid item>
        <DateOfBirth user={user} />
      </Grid>

    </Grid>)
  },
  { title: 'Email', field: 'email' },
  {
    title: 'Gender', field: 'gender',
    lookup: { 'male': 'Male', 'female': 'Female' },
    render: user => _.capitalize(user.gender)
  },
  {
    title: 'Student',
    filtering: true,
    field: 'is_student',
    lookup: { false: 'NO', true: 'YES' },
    render: r => r.is_student === true ? 'YES' : 'NO'
  },
  {
    title: 'Pincode', filtering: true,
    field: 'address[0].pin_code',
  },
  {
    title: 'Educational Background',
    field: 'course',
    render: user => (user.branch || user.course)
      ? (user.course ? user.course : '')
      + ","
      + (user.branch ? user.branch : '')
      : ''
  },
  {
    title: 'Coin Balance',
    field: 'course_balance',
    render: user => (user?.coin_balance?.length > 0)
      ? (user.coin_balance[0].balance)
      : 0
  }
]




function Users() {
  const history = useHistory();
  const users = useAsyncDataFrom(UserService.get);


  if (users.isLoading) {
    return 'loading..'
  }
  return (
    <>
      <Box >
        {/* <Button>
        <CSVLink
          data={users.data}
          filename={"users.csv"}
          target="_blank"
          style={{ textDecoration: 'none' }}
        >
          Download
        </CSVLink>
      </Button> */}
        <MaterialTable
          title="Users"
          isLoading={users.isLoading}
          columns={coloumns}
          data={(users && users.data && users.data.results && users.data.results.length > 0) ? users.data.results.map((d, index) => {
            return {
              ...d, index: index, age: d.dob ? moment(new Date()).diff(
                moment(d.dob),
                'years'
              ) : null
            }
          }) : []}
          options={{
            search: false,
            actionsColumnIndex: -1,
            pageSize: 20,
            pageSizeOptions: [20, 30, 40, 50],
            filtering: true,
          }}
          onRowClick={(e, data) => history.push(`user/${data.id}`)}
        />
      </Box >
    </>
  )



}
function DateOfBirth(user) {

  if (user.user.dob) {
    let years = moment(new Date()).diff(
      moment(user.user.dob),
      'years'
    );
    return '(' + years + ' years' + ')'
  }
  return null

}
export default Users;
