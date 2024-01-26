import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import {
  Grid,
  Card,
  Box,
  CardContent,
  Typography,
  Button,
  CardHeader,
  CardFooter,
  LinearProgress
} from '@material-ui/core';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import moment from 'moment'
import MyCard from 'views/Dashboard/MyCard';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import CustomComponent from 'views/Orders/OrderPage/CustomComponent';
import StaffUserService from 'services/repo/StaffUserService'
import _ from 'lodash';
import PieChart1 from 'components/PieChart1';

function CustomCard({ label, value }) {
  return (
    <Card elevation={10}>
      <div className='sample'>
        <CardContent>
          <Typography variant='h6'>{label}</Typography>
          <Typography variant='h3'>{value}</Typography>
        </CardContent>
      </div>
    </Card>
  );
}

export default function Dashboard(props) {
  var id = localStorage.getItem('id')
  const [state, setstate] = useState({
    isLoading: true,
    data: [],
    error: null
  })
  const [orders, setOrders] = useState({
    isLoading: true,
    data: [],
    error: null
  })

  useEffect(() => {
    getDashboard();
  }, []);

  function getDashboard() {
    StaffUserService.getDashboardView(id).then(res => {
      setstate({
        isLoading: false,
        data: res.data,
        error: null
      })
    }).catch(e => console.log(e))
  }

  function handleSubmit(values, { setErrors }) {
    console.log(values)
    if (!values.from_date) {
      getDashboard()
      return
    }
    values.staff_id = id;
    values.from_date = moment(moment.utc(values.from_date).toDate())
      .format('YYYY-MM-DD')
    values.to_date = moment(moment.utc(values.to_date).toDate())
      .format('YYYY-MM-DD')
    StaffUserService.getDashboard(values).then(res => {
      console.log(values)
      setstate({
        isLoading: false,
        data: res.data,
        error: null
      })
    })
  }
  const userData = [
    { name: 'Freemium', value: state.data.freemium },
    { name: 'Standard', value: state.data.standard },
    { name: 'Official', value: state.data.official },
  ];

  if (state.isLoading) {
    return <LinearProgress />
  }
  return (
    <>
      <Box display="flex"  alignItems="center"
        justifyContent="center">
        <Formik
          initialValues={{
            from_date: null,
            to_date: null,
            staff_id: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2} justify='space_between' alignItems="center">
                <Grid item >
                  <Typography variant='h6' style={{ fontWeight: '42px' }} color='primary' style={{ textAlign: 'left' }}>TOTAL ORDERS</Typography>
                </Grid>
                <Grid item>
                  <DatePicker maxDate={Date()} name='from_date' label='From Date' />
                </Grid>
                <Grid item>
                  <DatePicker minDate={values.from_date} name='to_date' label='To Date' />
                </Grid>
                <Grid item>
                  <Button type='submit' color='primary' variant='contained'>Filter</Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

      </Box>

      <Box p={2}>


        <Grid container style={{ paddingTop: 24 }} alignItems='center' spacing={4}>
          <Grid spacing={4} container justify='space-between' alignItems='stretch'>
            <Grid item xs={12} sm={6} xl={6} md={6} >
              <MyCard
                icon={<MenuBookIcon color='primary' style={{ fontSize: 35 }} />}
                title='No.of Assigned orders '
                value={state.data.assigned_orders} />
            </Grid>
            <Grid item xs={12} sm={6} xl={6} md={6} >
              <MyCard
                icon={<ShoppingCartIcon color='primary' style={{ fontSize: 35 }} />}
                title='No.of Processed orders'
                value={state.data.processing_orders} />
            </Grid>
            <Grid item xs={12} sm={6} xl={6} md={6} >
              <MyCard
                icon={<AssignmentTurnedInIcon color='primary' style={{ fontSize: 35 }} />}
                title='No.of Completed orders'
                value={state.data.completed_orders} />
            </Grid>
            <Grid item xs={12} sm={4} xl={6} md={6} >
              <PieChart1 data={userData} color="#388E3C" />
            </Grid>
          </Grid>
        </Grid>
      </Box >
    </>
  );
}
