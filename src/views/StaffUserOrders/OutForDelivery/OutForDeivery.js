import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { Box, Fab, Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import FornattedDateTime from 'components/FormattedDateTime';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom'
import _ from 'lodash';
import async from 'async';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import VisibilityOutlinedIcon from '@material-ui/icons/Visibility';
import OrderService from 'services/repo/OrderService';
import OrderStatusService from 'services/repo/OrderStatusService';
import { withSnackbar } from 'notistack';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

function OutForDelivery(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const id = localStorage.getItem('id');

  // const orders = useAsyncDataFrom(OrderService.getPending);
  const [orders, setOrders] = useState({
    isLoading: true,
    data: [],
    error: null
  })

  useEffect(() => {
    getOrders()
  }, []);


  function getOrders() {
    OrderService.getMyOutForDelivery(id).then(res => {
      setOrders({
        isLoading: false,
        data: res.data,
        error: null
      })
    }).catch(e => console.log(e))
  }
  function handleSubmit(values, { setErrors }) {
    if (!values) {
      getOrders()
    }
    values.id = id
    values.from_date = moment(moment.utc(values.from_date).toDate())
      .format('YYYY-MM-DD');
    values.to_date = moment(moment.utc(values.to_date).toDate())
      .format('YYYY-MM-DD')
    setOrders({
      isLoading: true,
      data: [],
      error: null
    })
    OrderService.getMyOutForDeliveryDate(values).then(res => {
      setOrders({
        isLoading: false,
        data: res.data,
        error: null
      })
    })
  }
  const handleListItemClick = (data) => {
    // setSelectedIndex(index);
    // console.log(event.target.value)
    console.log(data)
    async.map(data, function (item, cb) {
      let data = {}, statusData = {};
      statusData.order = item.id;
      statusData.status = 'delivered';
      statusData.user = id
      data.id = item.id;
      data.status = 'delivered'
      OrderService.update(data).then(res => {
        OrderStatusService.create(statusData).then(res => {
          getOrders()
          cb(null, res.data)
          props.enqueueSnackbar('Status changed ' + `${data.length}` + ' order(s) Successfully', {
            variant: 'success'
          });
        }).catch(e => console.log(e))
      }).catch(e => {
        cb(e)
        props.enqueueSnackbar('Error', {
          variant: 'error'
        });
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
      <Box >
        <MaterialTable
          title="Out for delivery Orders"
          isLoading={orders.isLoading}
          columns={[
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
            // { title: 'Order price', field: 'amount' },
            { title: 'Status', field: 'status', render: order => <Status order={order} /> },
            {
              title: 'Actions', render: r => (
                <Grid container spacing={1}>
                  <Grid item>
                    <Tooltip title='View Order'>
                      <IconButton
                        onClick={() => history.push(`order/${r.id}`)}
                        tooltip='View'>
                        <VisibilityOutlinedIcon size='small' color='primary' />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              )
            }
          ]}
          data={orders.data.map((d, index) => { return { ...d, index: index } })}
          options={{
            search: false,
            actionsColumnIndex: -1,
            pageSize: 20,
            filtering: true,
            selection: true,
            pageSizeOptions: [20, 30, 40, 50],
          }}
          actions={[
            {
              tooltip: 'Change Status to Delivered',
              icon: () => <AssignmentTurnedInOutlinedIcon color='primary' />,
              onClick: (evt, data) => handleListItemClick(data)
            }
          ]}
          localization={{
            toolbar: {
              nRowsSelected: '{0} Order(s) selected'
            }
          }}

        />
      </Box>
    </>
  )

  function Status(order) {
    console.log(order.order.status)
    switch (order.order.status) {
      case 'confirmed':
        return `${_.capitalize(order.order.status)} Payment`
      case 'assigned':
        return `${_.capitalize(order.order.status)} to ${_.capitalize(order.order.assigned_user_data.full_name)}`
      default:
        return `${_.capitalize(order.order.status)}`;
    }
  }
}

export default withSnackbar(OutForDelivery);

