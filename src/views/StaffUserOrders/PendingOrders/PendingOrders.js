import React, { useState, useEffect } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import MaterialTable from 'material-table';
import { Box, Fab, Button, Grid, Tooltip, IconButton } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons'
import OrderService from 'services/repo/OrderService';
import FornattedDateTime from 'components/FormattedDateTime';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import VisibilityOutlinedIcon from '@material-ui/icons/Visibility';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import moment from 'moment';
import * as Yup from 'yup';

function PendingOrders() {
  const history = useHistory();
  const match = useRouteMatch();
  const id = localStorage.getItem('id');
  // const orders = useAsyncDataFrom(() => OrderService.getMyPending(id));
  const [orders, setOrders] = useState({
    isLoading: true,
    data: [],
    error: null
  })

  useEffect(() => {
    getOrders()
  }, []);
  function getOrders() {
    OrderService.getMyPending(id).then(res => {
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
    OrderService.getMyPendingDate(values).then(res => {
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

      <Box >
        <MaterialTable
          title="Assigned Orders"
          isLoading={orders.isLoading}
          columns={[
            { title: 'S.NO', field: 's.no', render: d => d.index + 1, filtering: false },
            // { title: '24 HR', field: 's.no', render: d => d.index + 1, filtering: false },
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
            { title: 'Status', field: 'status', render: order => _.capitalize(order.status) },
            {
              title: 'Actions', render: r => (
                <Grid container spacing={1}>
                  <Tooltip title='View Order'>
                    <IconButton
                      onClick={() => history.push(`order/${r.id}`)}
                      tooltip='Assigned'>
                      <VisibilityOutlinedIcon size='small' color='primary' />
                    </IconButton>
                  </Tooltip>

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
        // actions={[
        //   {
        //     tooltip: 'Assign user for All Selected orders',
        //     icon: 'search',
        //     isFreeAction: true
        //   },
        // ]}

        />
      </Box>
    </>
  )
}

export default PendingOrders;
