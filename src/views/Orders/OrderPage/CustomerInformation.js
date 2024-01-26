import React from 'react';
import { Grid, Typography, Card, CardContent, CardHeader, Box } from '@material-ui/core';
import _ from 'lodash';
import CustomComponent from './CustomComponent';
function CustomerInformation({ order }) {
  function color(status) {
    var color;
    switch (status) {
      case "confirmed":
        color = "#E86972";
        break;
      case "assigned":
        color = "#56BEFF";
        break;
      case "processing":
        color = "#764ABC";
        break;
      case "out-for-delivery":
        color = "#F4B400";
        break;
      case "delivered":
        color = "#388E3C";
        break;
      default:
        color = "#388E3C";
    }
    return color
  }

  return <Card>
    <CardHeader
      avatar={
        <Typography
          color="textSecondary"
          gutterBottom
          variant="body2"
        >
          {"Customer Information"}
        </Typography>
      }
      action={
        <Box
          p={1}
          borderRadius={2}
          style={{ background: color(order.data.status), color: 'white' }}
        >
          <Typography
            gutterBottom
            variant="body2"
          >
            {_.capitalize(order.data.status)}
          </Typography>
        </Box>
      }
    />
    <CardContent>
      <Grid spacing={4} container justify="space-between">

        <CustomComponent
          size={4}
          title="Name"
          value={_.get(order.data, 'user_data.first_name')}
        />
        <CustomComponent
          size={4}
          title="Email"
          value={_.get(order.data, 'user_data.email')}
        />
        <CustomComponent
          size={4}
          title="Mobile"
          value={_.get(order.data, 'user_data.mobile')}
        />
      </Grid>
    </CardContent>
  </Card>
}

export default CustomerInformation;