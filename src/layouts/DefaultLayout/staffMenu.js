import React from 'react';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlineOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
export default [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon color='primary' />

  },
  {
    label: 'Orders',
    path: '/', // memory route
    icon: <ListAltOutlinedIcon color='primary' />,
    children: [
      {
        label: 'Assigned Orders',
        path: '/assigned_orders',
        icon: <ListAltOutlinedIcon color='primary' />,

      },
      {
        label: 'Out For Delivery Orders',
        path: '/out_for_delivery_orders',
        icon: <ListAltOutlinedIcon color='primary' />,

      },
      {
        label: 'Completed Orders',
        path: '/completed_orders',
        icon: <AssignmentTurnedInOutlinedIcon color='primary' />,

      },
    ],
  }
];