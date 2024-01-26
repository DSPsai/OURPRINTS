import React, { useState, useEffect } from 'react';
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
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import DashboardService from 'services/repo/DashboardService';
import OrderService from 'services/repo/OrderService';
import moment from 'moment'
import PieChart from 'components/PieChart';
import PieChart1 from 'components/PieChart1';

import MyCard from './MyCard';
import { Add } from '@material-ui/icons';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { People } from '@material-ui/icons';
import FaceIcon from '@material-ui/icons/Face';
import PersonIcon from '@material-ui/icons/Person';
import MoneyIcon from '@material-ui/icons/Money';
export default function Dashboard() {
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
    DashboardService.get().then(res => {
      setstate({
        isLoading: false,
        data: res.data,
        error: null
      })
    }).catch(e => console.log(e))
  }

  function handleSubmit(values, { setErrors }) {
    if (!values) {
      getDashboard()
      return
    }

    values.from_date = moment(moment.utc(values.from_date).toDate())
      .format('YYYY-MM-DD');
    values.to_date = moment(moment.utc(values.to_date).toDate())
      .format('YYYY-MM-DD')
    DashboardService.getDate(values).then(res => {
      setstate({
        isLoading: false,
        data: res.data,
        error: null
      })
    })
  }

  if (state.isLoading) {
    return <LinearProgress />
  }
  const userData = [
    { name: 'Freemium', value: state.data.freemium },
    { name: 'Standard', value: state.data.standard },
    { name: 'Official', value: state.data.official },

  ];
  return (
    <Box p={4}>
      <Formik
        initialValues={{
          from_date: '',
          to_date: ''
        }}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <Grid container spacing={2} justify='space_between' alignItems="center">
              <Grid item >
                <Typography variant='h6' style={{ fontWeight: '42px', textAlign: 'left' }} color='primary'>TOTAL ORDERS</Typography>
              </Grid>
              <Grid item>
                <DatePicker maxDate={Date()} name='from_date' label='From Date' />
              </Grid>
              <Grid item>
                <DatePicker maxDate={Date()} name='to_date' label='To Date' />
              </Grid>
              <Grid item>
                <Button type='submit' color='primary' variant='contained'>Filter</Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Grid container style={{ paddingTop: 24 }} alignItems='center' spacing={4}>
        <Grid item xs={12} sm={6} xl={9} md={9}>
          <Grid spacing={4} container justify='space-between' alignItems='stretch'>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<MenuBookIcon color='primary' style={{ fontSize: 35 }} />} title='Papers Printed'
                value={state.data.total_pages} />
            </Grid>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<ShoppingCartIcon color='primary' style={{ fontSize: 35 }} />} title='Total Orders Received'
                value={state.data.orders} />
            </Grid>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<AssignmentTurnedInIcon color='primary' style={{ fontSize: 35 }} />} title='Completed Orders'
                value={state.data.completed_orders} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} xl={3} md={3} style={{ paddingLeft: 48 }}>
          <PieChart1 data={userData} color="#388E3C" />
        </Grid>

      </Grid>
      <Grid container style={{ paddingTop: 24 }} spacing={2}>
        <Grid item xs={12} sm={6} xl={8} md={8}>
          <Grid spacing={4} container justify='space-around' alignItems='stretch'>
            <Grid item xs={12}>
              <Typography variant='h6' color='primary' style={{ textAlign: 'left' }}>TOTAL USERS</Typography>
            </Grid>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<People color='primary' style={{ fontSize: 35 }} />} title='Total Users'
                value={state.data.total_users} />
            </Grid>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<FaceIcon color='primary' style={{ fontSize: 35 }} />} title='Student Users'
                value={state.data.students} />
            </Grid>
            <Grid item xs={12} sm={6} xl={4} md={4} >
              <MyCard icon={<PersonIcon color='primary' style={{ fontSize: 35 }} />} title='Non Student Users'
                value={state.data.non_students} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} xl={4} md={4}>
          <Grid spacing={4} container justify='space-around' alignItems='stretch'>
            <Grid item xs={12}>
              <Typography variant='h6' color='primary' style={{ textAlign: 'left' }}>TOTAL REVENUE</Typography>
            </Grid>
            <Grid item xs={12} >
              <MyCard icon={<MoneyIcon color='primary' style={{ fontSize: 35 }} />} title='In Rupees'
                value={state.data.total_amount} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box >
  );
}