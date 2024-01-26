import React from 'react';
import { Grid, Typography, Card, CardContent, Button } from '@material-ui/core';
import _ from 'lodash';
import CustomComponent from './CustomComponent';
import { withSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Save';
import copy from 'copy-to-clipboard';

function AddressInformation({ order, ...props }) {
  function copyAddress() {

    let full_name = _.get(order.data, 'user_data.first_name', '') + " " + _.get(order.data, 'user_data.last_name', '');
    let address = _.get(order.data, 'address_data.address_line1') + " " +
      _.get(order.data, 'address_data.address_line2') + " " +
      _.get(order.data, 'address_data.landmark') + " " +
      _.get(order.data, 'address_data.pin_code') + " " +
      _.get(order.data, 'address_data.state');
    let phone_no = _.get(order.data, 'user_data.mobile');
    let alternate_number = _.get(order.data, 'address_data.alternate_number')
    var copyText = 'Name: ' + full_name + '\n' +
      'Address: ' + address + '\n' +
      'Mobile Number: ' + phone_no + '\n' +
      'Alternate Mobile Number: ' + alternate_number + '\n';
    copy(copyText, {
      debug: true,
      message: 'Press #{key} to copy',
    });
    props.enqueueSnackbar('Address copied Successfully', {
      variant: 'success'
    });
    // navigator.clipboard.writeText(copyText).then(function () {
    //   props.enqueueSnackbar('Address copied Successfully', {
    //     variant: 'success'
    //   });
    //   // console.log('Async: Copying to clipboard was successful!');
    // }, function (err) {
    //   console.error('Async: Could not copy text: ', err);
    // });
  }
  return <Card>
    <CardContent>
      <Grid spacing={4} container justify="space-between">
        <Grid item xs={8}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          >
            {"Address Information"}
          </Typography>

        </Grid>
        <Grid item xs={4}>
          <Button variant="contained"
            color="primary" endIcon={<SaveIcon />}
            onClick={copyAddress}> Copy Address</Button>
        </Grid>
        <CustomComponent
          size={4}
          title="Address line1"
          value={_.get(order.data, 'address_data.address_line1')}
        />
        <CustomComponent
          size={4}
          title="Address line2"
          value={_.get(order.data, 'address_data.address_line2')}
        />
        <CustomComponent
          size={4}
          title="Landmark"
          value={_.get(order.data, 'address_data.landmark')}
        />
        <CustomComponent
          size={4}
          title="Pincode"
          value={_.get(order.data, 'address_data.pin_code')}
        />
        <CustomComponent
          size={4}
          title="State"
          value={_.get(order.data, 'address_data.state')}
        />
        <CustomComponent
          size={4}
          title="Type"
          value={_.get(order.data, 'address_data.type')}
        />
        <CustomComponent
          size={4}
          title="Alternate Number"
          value={_.get(order.data, 'address_data.alternate_number')}
        />
        <CustomComponent
          size={8}
          title="Address Name"
          value={_.get(order.data, 'address_data.address_name')}
        />
      </Grid>
    </CardContent>
  </Card>
}

export default withSnackbar(AddressInformation);