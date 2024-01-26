import React, { useState } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import StaffUserService from 'services/repo/StaffUserService';
import { Box, Fab, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OrderService from 'services/repo/OrderService';
import { withSnackbar } from 'notistack';
import OrderStatusService from 'services/repo/OrderStatusService';
import async from 'async';
import AccountCircle from '@material-ui/icons/AccountCircle';
import withAlertDialog from 'components/withAlertDialog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));
function StaffUsers(props) {
  const users = useAsyncDataFrom(StaffUserService.get);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [assignedUser, setAssignedUser] = React.useState();

  const handleListItemClick = (user) => {
    if (!user) {
      return alert('please select staff user')
    }
    // setSelectedIndex(index);
    // console.log(event.target.value)
    console.log(props.data)
    async.map(props.data, function (item, cb) {
      let data = {}, statusData = {};
      statusData.order = item.id;
      statusData.status = 'assigned';
      statusData.user = user.id
      data.id = item.id;
      data.assigned_user = user.id;
      data.status = 'assigned'
      OrderService.update(data).then(res => {
        OrderStatusService.create(statusData).then(res => {
          props.refresh();
          props.setOpen(false)
          cb(null, res.data)
          props.enqueueSnackbar('Assigned ' + `${props.data.length}` + ' order(s) Successfully', {
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
      <Box >
        <Button variant="contained" color="primary">{"Total Orders: " +
          users.data.map((user, index) => user.assigned_orders)
            .reduce((a, b) => a + b, 0)}
        </Button>
        <List component="nav" aria-label="main mailbox folders">
          {
            users.data.map((user, index) => (
              <ListItem
                key={index}
                button
                selected={selectedIndex === index + 1}
                onClick={(event) => (
                  setSelectedIndex(index + 1),
                  setAssignedUser(user)
                  // handleListItemClick(event, index, user)
                )}
              >
                <ListItemIcon>
                  <AccountCircle color='primary' />
                </ListItemIcon>
                <ListItemText primary={user.full_name} secondary={'Pending Orders: ' + `${user.assigned_orders}`} />
              </ListItem>
            ))
          }
        </List>
        <Button color="primary" onClick={() => {
          if (assignedUser) {
            return props
              .showAlertDialog(
                `Are you sure that you want to assign ${props.data.length} order(s) to ${assignedUser.full_name}?`
              )
              .onOk(() => {
                handleListItemClick(assignedUser)
              }
              )
          } else {
            return props
              .showAlertDialog(
                `Please select Staff user`
              )
              .onOk(() =>props.cancelLabel
              
              )
          }
        }} variant="contained">Assign</Button>
      </Box>
    </>
  )
}

export default withAlertDialog(withSnackbar(StaffUsers));
