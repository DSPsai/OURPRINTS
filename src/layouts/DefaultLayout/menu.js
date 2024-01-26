import React from 'react'
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlineOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUpOutlined';
import CropFreeIcon from '@material-ui/icons/CropFree';
import BusinessIcon from '@material-ui/icons/Business';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import ShareIcon from '@material-ui/icons/Share';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
export default [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon color='primary' />
  },
  {
    label: 'Users',
    path: '/users',
    icon: <PeopleIcon color='primary' />
  },
  {
    label: 'Orders',
    path: '', // memory route
    icon: <ListAltOutlinedIcon color='primary' />,
    children: [
      {
        label: 'Pending Orders',
        path: '/pending_orders',
        icon: <ListAltOutlinedIcon color='primary' />,

      },
      {
        label: 'Assigned Orders',
        path: '/assigned_orders',
        icon: <ListAltOutlinedIcon color='primary' />,

      },
      {
        label: 'Completed Orders',
        path: '/completed_orders',
        icon: <AssignmentTurnedInOutlinedIcon color='primary' />,

      },
      {
        label: 'Total Orders',
        path: '/total_orders',
        icon: <AssignmentTurnedInOutlinedIcon color='primary' />,

      },
    ],
  },
  {
    label: 'Staff Users',
    path: '/staff_users',
    icon: <PeopleIcon color='primary' />
  },
  {
    label: 'Leads',
    path: '/leads',
    icon: <TrendingUpIcon color='primary' />
  },
  {
    label: 'QR Codes',
    path: '/qr_codes',
    icon: <CropFreeIcon color='primary' />
  },
  {
    label: 'Companies',
    path: '/client_companies',
    icon: <BusinessIcon color='primary' />
  },
  {
    label: 'Vouchers',
    path: '/vouchers',
    icon: <ConfirmationNumberOutlinedIcon color='primary' />
  },
  {
    label: 'Referrals',
    path: '/referrals',
    icon: <ShareIcon color='primary' />
  },
  {
    label: 'Coupons',
    path: '/coupons',
    icon: <ConfirmationNumberIcon color='primary' />
  },
];