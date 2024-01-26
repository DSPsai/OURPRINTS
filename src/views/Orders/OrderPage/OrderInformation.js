import React from 'react';
import { Grid, Typography, Button, Card, CardContent, } from '@material-ui/core';
import _ from 'lodash';
import { useRouteMatch, Link } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import CustomComponent from './CustomComponent';
import FormattedDateTime from 'components/FormattedDateTime';
import Configurations from './Configurations';
import SaveIcon from '@material-ui/icons/Save';
import { withSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';

function OrderInformation({ order, state, data, ...props }) {
  console.log(_.get(order.data, 'delivery_charge'))
  function copyAddress() {
    let full_name = _.get(order.data, 'user_data.first_name', '') + " " + _.get(order.data, 'user_data.last_name', '');
    let title = _.get(order.data, 'title') ? 'Title: ' + _.get(order.data, 'title') : 'Title: ' + 'No title given'
    var copyText = 'Name: ' + full_name + "," + '\n'
      + title
    copy(copyText, {
      debug: true,
      message: 'Press #{key} to copy',
    });
    props.enqueueSnackbar('Page title copied Successfully', {
      variant: 'success'
    });
  }
  return <Card>
    <CardContent>
      <Grid container spacing={4} justify='space-around'>
        <Grid item xs={8}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          >
            {"Order Information"}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained"
            color="primary" endIcon={<SaveIcon />}
            onClick={copyAddress}> Copy Front page title</Button>
        </Grid>
        <CustomComponent
          size={4}
          title="Order Id"
          value={_.get(order.data, 'order_id')}
        />
        <CustomComponent
          size={4}
          title="Date"
          value={<FormattedDateTime date={_.get(order.data, 'created_at')} />}
        />
        <CustomComponent
          size={4}
          title="Title"
          value={_.get(order.data, 'title')}
        />
        <CustomComponent
          size={4}
          title="Configuration"
          value={order.data.order_type}
        />
        <CustomComponent
          size={4}
          title="Pages"
          value={_.get(order.data, 'pdf_page_count')}
        />
        <CustomComponent
          size={4}
          title="Notes"
          value={_.get(order.data, 'notes')}
        />
        {
          state.data.is_superuser ?
            <CustomComponent
              size={4}
              title="Order Price"
              value={_.get(order.data, 'amount')}
            /> : null
        }
        <CustomComponent
          size={4}
          title="Multi color notes"
          value={_.get(order.data, 'multi_color_notes')}
        />
        <Grid item xs={4}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          >
            {"Front cover pdf"}
          </Typography>
          <a type="button"
            style={{ textDecoration: 'none' }}
            className="btn btn-secondary btn-lg"
            href={order.data.front_cover_pdf}
            download>
            <Link component={Button}
              startIcon={<GetAppIcon
                color='primary'
                fontSize='large'
                style={{ color: 'green', cursor: 'pointer' }}
              />}>
              Download
            </Link>
          </a>
        </Grid>
        <CustomComponent
          size={4}
          title="Front cover pdf info"
          value={_.get(order.data, 'front_cover_pdf_info')}
        />
        <CustomComponent
          size={4}
          title="File Name"
          value={_.get(order.data, 'file_name')}
        />
        <CustomComponent
          size={4}
          title="Delivery Charge"
          value={_.get(order.data, 'delivery_charge')}
        />
        <CustomComponent
          size={4}
          title="Page configuration"
          value={_.get(order.data, 'page_config')}
        />
      </Grid>
      <Configurations data={order.data} />
    </CardContent>
  </Card>
}

export default withSnackbar(OrderInformation);