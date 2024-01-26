import React, { useState, useEffect } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import MaterialTable from 'material-table';
import { Box, Fab, Grid, Button, Tooltip, IconButton, Typography } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons'
import OrderService from 'services/repo/OrderService';
import FornattedDateTime from 'components/FormattedDateTime';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import VisibilityOutlinedIcon from '@material-ui/icons/Visibility';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

function CompletedOrders(props) {
  const history = useHistory();
  const coloumns = [
    { title: 'S.NO', field: 's.no', render: d => d.index + 1, filtering: false },
    { title: 'Order Id', field: 'order_id' },
    { title: 'Date And Time', field: 'created_at', render: order => <FornattedDateTime date={order.created_at} /> },
    { title: 'Name', field: 'user_data.first_name' },
    {
      title: 'Category of Print',
      filtering: true,
      field: 'order_type',
      lookup: { 'standard_print': 'Standard', 'freemium': 'Freemium', 'official_documents': 'Official' },
    },
    { title: 'Number of pages', field: 'pdf_page_count' },
    { title: 'Order price', field: 'amount' },
    { title: 'Status', field: 'status', render: order => _.capitalize(order.status) },
    {
      title: 'Actions', render: r => (
        <Tooltip title='View Order'>
          <IconButton
            onClick={() => history.push(`order/${r.id}`)}
            tooltip='Assigned'>
            <VisibilityOutlinedIcon size='small' color='primary' />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  const [orders, setOrders] = useState({
    isLoading: true,
    data: [],
    error: null
  })

  useEffect(() => {
    getOrders()
  }, []);


  function getOrders() {
    OrderService.getCompleted().then(res => {
      setOrders({
        isLoading: false,
        data: res.data.results,
        error: null
      })
    }).catch(e => console.log(e))
  }

  // const orders = useAsyncDataFrom(OrderService.getCompleted);
  var amount = orders.data.map((i) => i.amount).reduce((a, b) => a + b, 0)
  var deliveryCharges = orders.data.map((i) => i.delivery_charge).reduce((a, b) => a + b, 0)
  var tamount = amount + deliveryCharges
  var tpages = orders.data.map((i) => i.pdf_page_count).reduce((a, b) => a + b, 0)
  function handleSubmit(values, { setErrors }) {
    if (!values) {
      getOrders()
    }
    values.from_date = moment(moment.utc(values.from_date).toDate())
      .format('YYYY-MM-DD');
    values.to_date = moment(moment.utc(values.to_date).toDate())
      .format('YYYY-MM-DD')
    setOrders({
      isLoading: true,
      data: [],
      error: null
    })
    OrderService.getCompletedDate(values).then(res => {
      setOrders({
        isLoading: false,
        data: res.data,
        error: null
      })
    })
  }

  return (
    <>
      <Box p={4} display="flex" alignItems="center"
        justifyContent="center">
        <Formik
          initialValues={{
            from_date: '',
            to_date: ''
          }}
          validationSchema={Yup.object({
            from_date: Yup.string().required('This field is Required'),
            to_date: Yup.string().required('This field is Required')
          })}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2} justify='space_between' alignItems="center">
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
      </Box>
      <Box>
        <MaterialTable
          title="Completed Orders"
          isLoading={orders.isLoading}
          columns={coloumns}
          data={orders.data.map((d, index) => { return { ...d, index: index } })}
          options={{
            search: false,
            actionsColumnIndex: -1,
            pageSize: 20,
            pageSizeOptions: [20, 30, 40, 50],
            filtering: true
          }}
          components={{
            Action:
              props => {
                if (props.action.icon === 'Total') {
                  return <Grid container spacing={1} justify="space-around">
                    <Grid item>
                      <Box textAlign='center' bgcolor='#43A046'>
                        <Typography
                          style={{ color: 'white', padding: 10, }}
                          variant='button' >{tpages} Pages Completed</Typography>

                      </Box>
                    </Grid>
                    <Grid item >
                      <Box textAlign='center' bgcolor='#43A046'>
                        <Typography
                          style={{ color: 'white', padding: 10, }}
                          variant='button' >Total Amount: {tamount.toFixed(2)}</Typography>

                      </Box>
                    </Grid>

                  </Grid>
                }

                return 'nothing'
              }
          }}
          actions={[
            {
              tooltip: 'Assign user for All Selected orders',
              iconProps: 'none',
              icon: 'Total',
              isFreeAction: true
            },

            // {
            //   tooltip: 'Assign user for All Selected orders',
            //   icon: () => <HowToRegIcon color='primary' />,
            //   onClick: (evt, data) => assignUser(data)
            // }
          ]}
        />
      </Box>
    </>
  )
}

export default CompletedOrders;