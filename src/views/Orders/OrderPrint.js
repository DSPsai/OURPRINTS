import React from 'react';
import { Grid, Typography, Box } from '@material-ui/core';
import { useRouteMatch, Link } from 'react-router-dom';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import OrderService from 'services/repo/OrderService';
function OrderPrint(props) {
  const match = useRouteMatch('/print/:id');
  const order = useAsyncDataFrom(() => OrderService.getById(match.params.id))
  if (order.isLoading) {
    return '...'
  }
  return (
    <Box>
      <Grid container justify='center' alignContent='center'>
        <Grid item xs={6} >
          <Typography>
            Customer Name
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {order.data.user_data.first_name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify='center' alignContent='center'>
        <Grid item xs={6}>
          <Typography>
            Title of print
        </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {order.data.title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify='center' alignContent='center'>
        <Grid item xs={6}>
          <Typography>
            Total Pages
            </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {order.data.pdf_page_count}
          </Typography>
        </Grid>
      </Grid>

    </Box>

  )
}

export default OrderPrint