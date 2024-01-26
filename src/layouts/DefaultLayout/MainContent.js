import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from 'views/Dashboard';
import PendingOrders from 'views/Orders/PendingOrders';
import CompletedOrders from 'views/Orders/CompletedOrders';
import AssignedOrders from 'views/Orders/AssignedOrders'
import TotalOrders from 'views/Orders/TotalOrders';
import Users from 'views/Users';
import StaffUser from 'views/StaffUser';
import OrderPage from 'views/Orders/OrderPage';
import UpadatePassword from 'views/UpdatePassword/UpadatePassword';
import UserProfile from 'views/UserProfile';
import Leads from 'views/Leads';
import QrCodes from 'views/QrCodes';
import ClientCompanies from 'views/ClientCompanies';
import Vouchers from 'views/Vouchers';
import CreateClientComapny from 'views/CreateClientComapny';
import Referrals from 'views/Referrals';
import Coupons from 'views/Coupons/Coupons';

function Routes() {
  return (
    <Switch>
      <Route path='/leads'>
        <Leads />
      </Route>
      <Route path='/user/:id'>
        <UserProfile />
      </Route>
      <Route path='/update_password'>
        <UpadatePassword />
      </Route>

      <Route path='/staff_users'>
        <StaffUser />
      </Route>
      <Route path='/total_orders'>
        <TotalOrders />
      </Route>
      <Route path='/completed_orders'>
        <CompletedOrders />
      </Route>
      <Route path='/pending_orders'>
        <PendingOrders />
      </Route>
      <Route path='/assigned_orders'>
        <AssignedOrders />
      </Route>
      <Route path='/order/:id'>
        <OrderPage />
      </Route>
      <Route exact path='/qr_codes'>
        <QrCodes />
      </Route>
      <Route exact path='/client_companies'>
        <ClientCompanies />
      </Route>
      <Route exact path='/vouchers'>
        <Vouchers />
      </Route>
      <Route path='/referrals'>
        <Referrals />
      </Route>
      <Route exact path='/clientVouchers'>
        <Vouchers />
      </Route>
      <Route exact path='/client_companies/:viewType'>
        <CreateClientComapny />
      </Route>
      <Route path='/users'>
        <Users />
      </Route>
      <Route path='/coupons'>
        <Coupons />
      </Route>
      <Route path='/dashboard'>
        <Dashboard />
      </Route>
      <Route exact path="/" render={() => (
        <Redirect to={{
          pathname: "/dashboard"
        }} />
      )}>
      </Route>
    </Switch>
  );
}

export default Routes;
