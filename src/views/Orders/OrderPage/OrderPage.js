import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Paper, Button, LinearProgress } from '@material-ui/core'
import OrderService from 'services/repo/OrderService';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import { useRouteMatch, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import async from 'async';
import _ from 'lodash';
import ConfigiurationService from 'services/repo/ConfigiurationService';
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react';
import FormattedDateTime from 'components/FormattedDateTime';
import OrderStatusService from 'services/repo/OrderStatusService';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DatePicker } from 'components/formFields';
import { Form, Formik, Field } from 'formik';
import TextField from '../../../components/formFields/TextField';
import { withSnackbar } from 'notistack';
import CustomerInformation from './CustomerInformation';
import OrderInformation from './OrderInformation';
import Configurations from './Configurations';
import AddressInformation from './AddressInformation';
import BackButton from 'components/BackButton';
import copy from 'copy-to-clipboard';
import * as yup from 'yup';
const schema = yup.object().shape({
  delivery_id: yup.string()
    .max(30, 'Only 30 Characters are allowed')
    .required('Delivery Id is requried.'),
  delivery_date: yup.string().required('Delivery Date is required')
})

function OrderPage(props) {
  const match = useRouteMatch('/order/:id');
  const [data, setData] = useState([]);
  const userState = useSelector(state => state.shared.user);

  const order = useAsyncDataFrom(() => OrderService.getById(match.params.id))
  const confirmed = useAsyncDataFrom(() => OrderStatusService.getByOrder(match.params.id, 'confirmed'))

  const assigned = useAsyncDataFrom(() => OrderStatusService.getByOrder(match.params.id, 'assigned'))
  const processing = useAsyncDataFrom(() => OrderStatusService.getByOrder(match.params.id, 'processing'))
  const outForDelivery = useAsyncDataFrom(() => OrderStatusService.getByOrder(match.params.id, 'out-for-delivery'))
  const delivered = useAsyncDataFrom(() => OrderStatusService.getByOrder(match.params.id, 'delivered'))

  const date = new Date();
  date.setDate(date.getDate() + 3);
  console.log(assigned.data[0])
  useEffect(() => {
    async.map(order.data.configurations, function (item, cb) {
      ConfigiurationService.getById(item).then(res => {
        cb(null, res.data)
      }).catch(e => cb(e))
    }, function (err, results) {
      if (err) {
        console.log(err);
        return;
      }
      setData(results)
      console.log(results.map(i => i))
    });
  }, [order.data])


  const handleClick = (event, index) => {

    console.log(event)
    let data = {}, statusData = {};
    statusData.order = order.data.id;
    statusData.status = event;
    statusData.user = order.data.assigned_user
    data.id = order.data.id;
    data.status = event
    OrderService.update(data).then(res => {
      OrderStatusService.create(statusData).then(res => {
        order.refresh();
        processing.refresh();
        outForDelivery.refresh()
        delivered.refresh();
        props.enqueueSnackbar('Processed Successfully', {
          variant: 'success'
        });
      }).catch(e => console.log(e))
    }).catch(e => {
      props.enqueueSnackbar('Error', {
        variant: 'error'
      });
    }
    )
  };

  const handleUpdate = (values) => {
    console.log(values)
    delete values.pdf;
    OrderService.update(values).then(res => {
      order.refresh();
      processing.refresh();
      outForDelivery.refresh()
      delivered.refresh();
      props.enqueueSnackbar('Processed Successfully', {
        variant: 'success'
      });
    }).catch(e => {
      props.enqueueSnackbar('Error', {
        variant: 'error'
      });
    }
    )
  };

  function handleSubmit(values, { setErrors }) {
    console.log(values)
    delete values.pdf;
    delete values.front_cover_pdf;
    let statusData = {};
    statusData.order = order.data.id;
    statusData.status = 'out-for-delivery';
    statusData.user = order.data.assigned_user
    values.status = 'out-for-delivery';
    OrderService.update(values).then(res => {
      OrderStatusService.create(statusData).then(res => {
        order.refresh();
        processing.refresh();
        outForDelivery.refresh()
        delivered.refresh();
        props.enqueueSnackbar('Updated Successfully', {
          variant: 'success'
        });
      }).catch(e => console.log(e))
    }).catch(e => {
      props.enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    })
  }

  if (order.isLoading) {
    return <LinearProgress />
  }

  return (
    <Box>
      <BackButton path='/pending_orders' />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomerInformation order={order} />
        </Grid>
        <Grid item xs={12}>
          <OrderInformation state={userState} order={order} data={data} />
        </Grid>
        <Grid item xs={12}>
          <AddressInformation order={order} />
        </Grid>
      </Grid>

      {/* <Configurations data={data} /> */}
      <Box pt={4} color='green'>
        <Grid container justify='center' alignContent='center'>
          <Typography variant='h6'>Order Timeline</Typography>
        </Grid>
      </Box>
      <Timeline lineColor={'#ddd'}>
        <TimelineItem
          dateText={`Confirmed`}
          style={{ color: 'green', marginRight: '-50px' }}>
          <Paper elevation={2}>
            <Box p={2}>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                {"Date:"}
              </Typography>
              <Typography component='p'>
                {<FormattedDateTime date={order.data.created_at} />}
              </Typography>
            </Box>
          </Paper>

        </TimelineItem>
        {
          assigned.data[0] ?
            <TimelineItem
              dateText={`Assigned`}
              dateInnerStyle={{ background: '#56BEFF', color: 'white' }}
              style={{ color: 'green', marginRight: '-50px' }}>
              <Paper elevation={2}>
                <Box p={2}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {"Date:"}
                  </Typography>
                  <Typography component='p'>
                    {<FormattedDateTime date={_.get(assigned.data[0], 'created_at')} />}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {"Assigned to:"}
                  </Typography>
                  <Typography component='p'>
                    {_.get(order.data, 'assigned_user_data.full_name')}
                  </Typography>

                  {
                    processing.data[0]
                      ? <a type="button"
                        style={{ textDecoration: 'none' }}
                        className="btn btn-secondary btn-lg"
                        href={order.data.pdf}
                        target="blank">
                        <Link component={Button}
                          startIcon={<GetAppIcon
                            color='primary'
                            fontSize='large'
                            style={{ color: 'green', cursor: 'pointer' }}
                          />}>
                          Download PDF Again
                      </Link>
                      </a>
                      : <a type="button"
                        style={{ textDecoration: 'none' }}
                        className="btn btn-secondary btn-lg"
                        href={order.data.pdf}
                        target="blank"
                      >
                        <Link component={Button}
                          onClick={() => handleClick('processing')}
                          startIcon={<GetAppIcon
                            color='primary'
                            fontSize='large'
                            style={{ color: 'green', cursor: 'pointer' }}
                          />}>
                          Download PDF To Process
                        </Link>
                      </a>
                  }
                </Box>
              </Paper>
            </TimelineItem>
            : null
        }
        {
          processing.data[0]
            ? <TimelineItem
              dateText={`Processing`}
              dateInnerStyle={{ background: '#764ABC', color: 'white' }}

              style={{ color: 'green', marginRight: '-50px' }}>
              <Paper elevation={2}>
                <Box p={2}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {"Date:"}
                  </Typography>
                  <Typography component='p'>
                    {<FormattedDateTime date={_.get(processing.data[0], 'created_at')} />}
                  </Typography>
                  {order.data.delivery_date ?
                    <div>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                      >
                        {"Delivery Id:"}
                      </Typography>
                      <Typography component='p'>
                        {order.data.delivery_id}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                      >
                        {"Delivery Date:"}
                      </Typography>
                      <Typography component='p'>
                        {<FormattedDateTime date={_.get(order.data, 'delivery_date')} />}
                      </Typography>
                    </div>
                    : <Formik
                      initialValues={{
                        id: order.data.id,
                        delivery_id: "",
                        delivery_date: ""
                      }}
                      validationSchema={schema}
                      onSubmit={handleSubmit}>
                      {({ values }) => (
                        <Form>
                          <TextField
                            margin='dense'
                            name='delivery_id'
                            label='Delivery Id '
                            variant='outlined'
                            fullWidth
                          />
                          <DatePicker
                            fullWidth
                            minDate={Date()}
                            maxDate={date}
                            name='delivery_date'
                            label='Delivery Date' />
                          <Box mt={2}>
                            {
                              order.data.delivery_date ?
                                <Button
                                  fullWidth
                                  width='100%'
                                  size='large'
                                  onClick={() => {
                                    handleUpdate(values)
                                  }}
                                  color='primary'
                                  variant='contained'>
                                  Update
                             </Button>
                                : <Button
                                  fullWidth
                                  width='100%'
                                  size='large'
                                  type='submit'
                                  color='primary'
                                  variant='contained'>
                                  Submit
                             </Button>
                            }
                          </Box>
                        </Form>
                      )}
                    </Formik>
                  }
                </Box>
              </Paper>
            </TimelineItem>
            : null
        }
        {
          outForDelivery.data[0] ?
            <TimelineItem color='green'
              dateText={`Out for delivery`}
              dateInnerStyle={{ background: '#F4B400', color: 'white' }}
              style={{ color: 'green', marginRight: '-50px' }}>
              <Paper elevation={2}>
                <Box p={2}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {"Date:"}
                  </Typography>
                  <Typography component='p'>
                    {<FormattedDateTime date={outForDelivery.data[0].created_at} />}
                  </Typography>
                  {
                    delivered.data[0] ?
                      <Button
                        fullWidth
                        width='100%'
                        size='large'
                        color='primary'
                        variant='contained'>
                        Delivered
                   </Button>
                      :
                      <Button
                        fullWidth
                        width='100%'
                        size='large'
                        onClick={() => {
                          handleClick('delivered')
                        }}
                        color='primary'
                        variant='contained'>
                        Is Delivered
                  </Button>
                  }
                </Box>
                <PrintOrder order={order} />
              </Paper>
            </TimelineItem>
            : null
        }
        {
          delivered.data[0] ?
            <TimelineItem
              dateText={`Delivered`}
              dateInnerStyle={{ background: '#388E3C', color: 'white' }}
              style={{ color: 'green', marginRight: '-50px' }}>
              <Paper elevation={2}>
                <Box p={2}>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    {"Date:"}
                  </Typography>
                  <Typography component='p'>
                    {<FormattedDateTime date={delivered.data[0].created_at} />}
                  </Typography>
                </Box>
              </Paper>
            </TimelineItem>
            : null
        }
      </Timeline>
    </Box >
  )
}

export default withSnackbar(OrderPage);

function PrintOrder({ order }) {
  const printIframe = (id) => {
    const iframe = document.frames ? document.frames[id] : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;

    iframe.focus();
    iframeWindow.print();

    return false;
  };
  return <div>
    <iframe id="receipt" src={"/print/" + order.data.id} order style={{ display: 'none' }}
      title="Receipt" />
    <Button onClick={() => printIframe('receipt')}>
      Print
    </Button>
  </div>
}