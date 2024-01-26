import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';
import { Box, Fab, Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import OrderService from 'services/repo/OrderService';
import FornattedDateTime from 'components/FormattedDateTime';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom';
import useDrawer from 'hooks/useDrawer';
import withDrawer from 'components/hoc/withDrawer';
import AssignStaffUser from 'views/StaffUser/AssignStaffUser'
import AssignStaffUserMulti from 'views/StaffUser/AssignStaffUserMulti'
import _ from 'lodash'
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircle';
import VisibilityOutlinedIcon from '@material-ui/icons/Visibility';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

function PendingOrders() {
  const history = useHistory();
  const match = useRouteMatch();
  const assignStaffUser = useDrawer();
  const assignStaffUserMulti = useDrawer();

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
    OrderService.getPending().then(res => {
      setOrders({
        isLoading: false,
        data: res.data.results,
        error: null
      })
    }).catch(e => console.log(e))
  }

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
    OrderService.getPendingDate(values).then(res => {
      setOrders({
        isLoading: false,
        data: res.data,
        error: null
      })
    })
  }

  function assignUser(data) {
    assignStaffUserMulti.setOpen(true);
    assignStaffUserMulti.setData(data)
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
        <AssignStaffUserDrawer refresh={getOrders}  {...assignStaffUser} title="Assign Staff User" />
        <AssignStaffUserMultiDrawer refresh={getOrders}  {...assignStaffUserMulti} title="Assign Staff User" />
        <MaterialTable
          title="Pending Orders"
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
            { title: 'Order price', field: 'amount' },
            { title: 'Status', field: 'status', render: order => <Status order={order} /> },
            {
              title: 'Actions', render: r => (
                <Grid container spacing={1}>
                  <Grid item>
                    <Tooltip title='View Order'>
                      <IconButton
                        onClick={() => history.push(`order/${r.id}`)}
                        tooltip='Assigned'>
                        <VisibilityOutlinedIcon size='small' color='primary' />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    {
                      r.assigned_user
                        ? <Tooltip title='Assigned'>
                          <IconButton tooltip='Assigned'>
                            <HowToRegIcon color='primary' />
                          </IconButton>
                        </Tooltip>
                        : <Tooltip title='Assign'>
                          <IconButton onClick={() => (
                            assignStaffUser.setData(r),
                            assignStaffUser.setOpen(true))}>
                            <AccountCircleOutlinedIcon color='primary' />
                          </IconButton>
                        </Tooltip>
                    }
                  </Grid>
                </Grid>
              )
            }
          ]}
          data={orders.data.map((d, index) => { return { ...d, index: index } })}
          options={{
            showSelectAllCheckbox: true,
            search: false,
            actionsColumnIndex: -1,
            pageSize: 20,
            filtering: true,
            selection: true,
            pageSizeOptions: [20, 30, 40, 50],
          }}
          components={{
            Action:
              props => {
                if (props.action.icon == 'search') {
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

                  )
                }

                return (
                  <IconButton
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                    aria-label={props.action.icon}
                    onClick={(event) => {
                      props.action.onClick(event, props.data);
                    }}
                  >
                    <HowToRegIcon color='primary' />
                  </IconButton>
                )
              }
          }}
          actions={[
            // {
            //   tooltip: 'Assign user for All Selected orders',
            //   iconProps: 'none',
            //   icon: 'search',
            //   isFreeAction: true
            // },
            {
              tooltip: 'Assign user for All Selected orders',
              icon: () => <HowToRegIcon color='primary' />,
              onClick: (evt, data) => assignUser(data)
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

export default PendingOrders;
const AssignStaffUserDrawer = withDrawer(AssignStaffUser);
const AssignStaffUserMultiDrawer = withDrawer(AssignStaffUserMulti);

