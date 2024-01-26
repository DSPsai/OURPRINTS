import React, { useState } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import StaffUserService from 'services/repo/StaffUserService';
import { Box, Fab, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OrderService from 'services/repo/OrderService';
import { withSnackbar } from 'notistack';
import OrderStatusService from 'services/repo/OrderStatusService';
import AccountCircle from '@material-ui/icons/AccountCircle';
import withAlertDialog from 'components/withAlertDialog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    backgroundColor: 'red',
  },
}));
function StaffUsers(props) {
  const users = useAsyncDataFrom(StaffUserService.get);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [assignedUser, setAssignedUser] = React.useState();

  const classes = useStyles()

  const handleListItemClick = (user) => {
    console.log(props.data)
    let data = {}, statusData = {};
    statusData.order = props.data.id;
    statusData.status = 'assigned';
    statusData.user = user.id
    data.id = props.data.id;
    data.assigned_user = user.id;
    data.status = 'assigned'
    OrderService.update(data).then(res => {
      OrderStatusService.create(statusData).then(res => {
        props.refresh();
        props.setOpen(false)
        props.enqueueSnackbar('Assigned Successfully', {
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

  return (
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
              `Are you sure that you want to assign order to ${assignedUser.full_name}?`
            )
            .onOk(() => {
              handleListItemClick(assignedUser)
            }
            )
        } else {
          return  props
          .showAlertDialog(
            `Please select Staff user`
          )
          .onOk(() =>props.cancelLabel
          
          )
        }
      }} variant="contained">Assign</Button>
    </Box>
  )
}

export default withAlertDialog(withSnackbar(StaffUsers));
